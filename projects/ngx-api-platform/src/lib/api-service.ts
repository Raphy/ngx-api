import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpParams, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injector } from '@angular/core';
import { forkJoin, Observable, of, throwError } from 'rxjs';
import { filter, map, share, switchMap } from 'rxjs/operators';
import { ApiPlatformConfig } from './api-platform-config';
import { MetadataKey, PropertyMetadata, ResourceMetadata, SubCollectionMetadata, SubResourceMetadata } from './metadata';
import { ApiServiceCollectionOptions, ApiServiceDeleteOptions, ApiServiceItemOptions, ApiServicePersistOptions } from './options';
import { ResourceSerializer } from './serializer';
import { assertResource, assertResourceMetadataExists, extractEndpointAndIdentifierFromIri, resourceIri } from './utils';

export function ApiServiceTokenFor(ResourceClass: Function): string {
  assertResourceMetadataExists(ResourceClass);

  const resourceMetadata: ResourceMetadata = Reflect.getMetadata(MetadataKey.Resource, ResourceClass);

  return `API_PLATFORM_API_SERVICE_${ ResourceClass.name }_${ resourceMetadata.options.endpoint }`;
}

export class ApiService<TResource extends Object> {
  private readonly resourceMetadata: ResourceMetadata;

  private readonly propertiesMetadata: { [propertyName: string]: PropertyMetadata };

  private readonly subResourcesMetadata: { [propertyName: string]: SubResourceMetadata };

  private readonly subCollectionsMetadata: { [propertyName: string]: SubCollectionMetadata };

  constructor(
    private ResourceClass: Function,
    private config: ApiPlatformConfig,
    private httpClient: HttpClient,
    private resourceSerializer: ResourceSerializer,
    private injector: Injector,
  ) {
    assertResource(ResourceClass);

    this.resourceMetadata = Reflect.getMetadata(MetadataKey.Resource, ResourceClass);
    this.propertiesMetadata = Reflect.getMetadata(MetadataKey.Properties, ResourceClass);
    this.subResourcesMetadata = Reflect.getMetadata(MetadataKey.SubResources, ResourceClass) || {};
    this.subCollectionsMetadata = Reflect.getMetadata(MetadataKey.SubCollections, ResourceClass) || {};
  }

  findItem(identifierOrIri: string | number, options?: ApiServiceItemOptions): Observable<TResource> {
    options = options || {};

    let identifier: string | number = identifierOrIri.toString();
    if (identifier.startsWith('/')) {
      const [iriEndpoint, iriIdentifier] = extractEndpointAndIdentifierFromIri(identifierOrIri.toString());
      if (iriEndpoint !== this.resourceMetadata.options.endpoint) {
        throw new Error(`The IRI "${ identifierOrIri }" is not compatible with the resource endpoint "${ this.resourceMetadata.options.endpoint }". Maybe the wrong API Service ?`);
      }
      identifier = iriIdentifier;
    }

    const request = new HttpRequest<any>(
      'GET',
      `${ this.config.apiBaseUrl }/${ this.resourceMetadata.options.endpoint }/${ identifier }`,
      {
        params: new HttpParams({fromObject: options.params || {}}),
        headers: new HttpHeaders(options.headers || {}),
      },
    );

    return this.httpClient.request<any>(request)
      .pipe(
        filter((event: HttpEvent<any>) => event.type === HttpEventType.Response),
        map((response: HttpResponse<any>) => response.body),
        switchMap((resourceData: object) => this.deserializeResource(resourceData)),
        share(),
      )
      ;
  }

  findCollection(options?: ApiServiceCollectionOptions): Observable<Array<TResource>> {
    options = options || {};
    options.endpoint = options.endpoint || this.resourceMetadata.options.endpoint;
    options.endpoint = options.endpoint.startsWith('/') ? options.endpoint.substr(1) : options.endpoint;

    const request = new HttpRequest<any>(
      'GET',
      `${ this.config.apiBaseUrl }/${ options.endpoint }`,
      {
        params: new HttpParams({fromObject: options.params || {}}),
        headers: new HttpHeaders(options.headers || {}),
      },
    );

    return this.httpClient.request<any>(request)
      .pipe(
        filter((event: HttpEvent<any>) => event.type === HttpEventType.Response),
        map((response: HttpResponse<any>) => response.body as object),
        switchMap((collectionData: object) => forkJoin(
          ...(collectionData['hydra:member'] || collectionData)
            .map(
              (resourceData: object) => this.deserializeResource(resourceData),
            ),
        ) as Observable<Array<TResource>>),
        share(),
      )
      ;
  }

  persist(resource: TResource, options?: ApiServicePersistOptions): Observable<TResource> {
    options = options || {};

    return this.serializeResource(resource)
      .pipe(
        switchMap((object: object) => {
          let request: HttpRequest<any>;
          if (resource[this.resourceMetadata.options.identifierPropertyName]) {
            request = new HttpRequest<any>(
              'PUT',
              `${ this.config.apiBaseUrl }/${ this.resourceMetadata.options.endpoint }/${ resource[this.resourceMetadata.options.identifierPropertyName] }`,
              object,
              {
                params: new HttpParams({fromObject: options.params || {}}),
                headers: new HttpHeaders(options.headers || {}),
              },
            );
          } else {
            request = new HttpRequest<any>(
              'POST',
              `${ this.config.apiBaseUrl }/${ this.resourceMetadata.options.endpoint }`,
              object,
              {
                params: new HttpParams({fromObject: options.params || {}}),
                headers: new HttpHeaders(options.params || {}),
              },
            );
          }

          return this.httpClient.request<any>(request);
        }),
        filter((event: HttpEvent<any>) => event.type === HttpEventType.Response),
        map((response: HttpResponse<any>) => response.body),
        switchMap((resourceData: object) => this.deserializeResource(resourceData)),
        share(),
      )
      ;
  }

  delete(resource: TResource, options?: ApiServiceDeleteOptions): Observable<void> {
    options = options || {};
    if (!resource[this.resourceMetadata.options.identifierPropertyName]) {
      return throwError(new Error(`The resource could not be deleted because an identifier value should be defined.`));
    }

    const request = new HttpRequest<any>(
      'DELETE',
      `${ this.config.apiBaseUrl }/${ this.resourceMetadata.options.endpoint }/${ resource[this.resourceMetadata.options.identifierPropertyName] }`,
      {
        params: new HttpParams({fromObject: options.params || {}}),
        headers: new HttpHeaders(options.headers || {}),
      },
    );

    return this.httpClient.request<any>(request)
      .pipe(
        filter((event: HttpEvent<any>) => event.type === HttpEventType.Response),
        map((response: HttpResponse<any>) => response.body),
        map(() => null),
        share(),
      )
      ;
  }

  private serializeResource(resource: TResource): Observable<object> {
    return of(this.resourceSerializer.serialize(resource, this.ResourceClass))
      .pipe(
        switchMap((object: object) => {
          const subResourcesObservables: Array<Observable<any>> = [];

          for (const propertyName in this.subResourcesMetadata) {
            if (this.propertiesMetadata[propertyName].options.input && !!resource[propertyName]) {
              subResourcesObservables.push(
                resource[propertyName]
                  .pipe(
                    map((subResource) => object[this.propertiesMetadata[propertyName].options.name] = resourceIri(subResource)),
                  ),
              );
            }
          }

          if (subResourcesObservables.length > 0) {
            return forkJoin(subResourcesObservables).pipe(map(() => object));
          }

          return of(object);
        }),
      )
      ;
  }

  private deserializeResource(object: object): Observable<TResource> {
    const resource = this.resourceSerializer.deserialize(object, this.ResourceClass) as TResource;

    for (const propertyName in this.subResourcesMetadata) {
      const subResourceMetadata: SubResourceMetadata = this.subResourcesMetadata[propertyName];

      if (this.propertiesMetadata[propertyName].options.output && object[this.propertiesMetadata[propertyName].options.name]) {
        const subResourceApiService: ApiService<any> = this.injector.get(ApiServiceTokenFor(subResourceMetadata.options.SubResourceClass()));
        resource[subResourceMetadata.propertyName] = subResourceApiService.findItem(
          object[this.propertiesMetadata[propertyName].options.name],
          subResourceMetadata.options.apiServiceItemOptions
            ? (typeof subResourceMetadata.options.apiServiceItemOptions === 'object'
            ? subResourceMetadata.options.apiServiceItemOptions
            : subResourceMetadata.options.apiServiceItemOptions(resource))
            : {},
        );
      }

    }

    for (const propertyName in this.subCollectionsMetadata) {
      const subCollectionMetadata: SubCollectionMetadata = this.subCollectionsMetadata[propertyName];

      const subResourceApiService: ApiService<any> = this.injector.get(
        ApiServiceTokenFor(subCollectionMetadata.options.SubResourceClass())
      );
      resource[subCollectionMetadata.propertyName] = subResourceApiService.findCollection(
        {
          ...(subCollectionMetadata.options.apiServiceCollectionOptions
            ? (typeof subCollectionMetadata.options.apiServiceCollectionOptions === 'object'
              ? subCollectionMetadata.options.apiServiceCollectionOptions
              : subCollectionMetadata.options.apiServiceCollectionOptions(resource))
            : {}),
          endpoint: `/${ this.resourceMetadata.options.endpoint }/${ resource[this.resourceMetadata.options.identifierPropertyName] }/${ subCollectionMetadata.options.subEndpoint }`,
        },
      );
    }

    return of(resource);
  }
}
