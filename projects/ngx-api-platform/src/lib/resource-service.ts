import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpParams, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable, InjectionToken, Injector } from '@angular/core';
import { Observable, of } from 'rxjs';
import { filter, map, mapTo, share, shareReplay, switchMap } from 'rxjs/operators';
import { API_PLATFORM_CONFIG, ApiPlatformConfig } from './api-platform-config';
import {
  IdentifierMetadata,
  InputMetadata,
  OutputMetadata,
  PropertyMetadata,
  ResourceMetadata,
  SubCollectionMetadata,
  SubResourceMetadata,
  getIdentifierMetadata,
  getInputsMetadata,
  getOutputsMetadata,
  getPropertiesMetadata,
  getResourceMetadata,
  getSubCollectionsMetadata,
  getSubResourcesMetadata,
  validateMetadata,
} from './mapping';
import { ResourceServiceOptions } from './resource-service-options';
import { Serializer } from './serialization';

/**
 * Stores the InjectionToken instances because they need to be "unique" across the application.
 */
const injectionTokens: { [description: string]: InjectionToken<any> } = {};

export function ResourceServiceTokenFor<TResource>(target: Function): InjectionToken<TResource> {
  const description = `API_PLATFORM_RESOURCE_SERVICE_${ target.name }`;
  if (!injectionTokens.hasOwnProperty(description)) {
    injectionTokens[description] = new InjectionToken<TResource>(description);
  }

  return injectionTokens[description];
}

export function resourceServiceFactory<TResource>(target: Function): Function {
  return (injector: Injector) => new ResourceService<TResource>(target, injector);
}

@Injectable()
export class ResourceService<TResource> {
  private metadata: {
    resource: ResourceMetadata;
    properties: Array<PropertyMetadata>;
    subResources: Array<SubResourceMetadata>;
    subCollections: Array<SubCollectionMetadata>;
    identifier: IdentifierMetadata;
    inputs: Array<InputMetadata>;
    outputs: Array<OutputMetadata>;
  };

  constructor(private target: Function, private injector: Injector) {
    if (this.config.resourceMappingValidation === 'enabled') {
      validateMetadata(target);
    }

    this.metadata = {
      resource: getResourceMetadata(target),
      properties: getPropertiesMetadata(target),
      subResources: getSubResourcesMetadata(target),
      subCollections: getSubCollectionsMetadata(target),
      identifier: getIdentifierMetadata(target),
      inputs: getInputsMetadata(target),
      outputs: getOutputsMetadata(target),
    };
  }

  private get config(): ApiPlatformConfig {
    return this.injector.get<ApiPlatformConfig>(API_PLATFORM_CONFIG);
  }

  private get httpClient(): HttpClient {
    return this.injector.get<HttpClient>(HttpClient);
  }

  private get serializer(): Serializer {
    return this.injector.get<Serializer>(Serializer);
  }

  getResource(identifier: string | number, options?: ResourceServiceOptions): Observable<TResource> {
    // Handle IRI
    if (typeof identifier === 'string' && identifier.startsWith(`/${ this.metadata.resource.options.endpoint }/`)) {
      identifier = identifier.substring(`/${ this.metadata.resource.options.endpoint }/`.length);
    }

    const finalOptions = Object.assign({}, options || {});
    finalOptions.request = finalOptions.request || {};
    finalOptions.request.method = finalOptions.request.method || 'GET';
    finalOptions.request.uri = finalOptions.request.uri || `/${ this.metadata.resource.options.endpoint }/${ identifier }`;
    finalOptions.request.params = finalOptions.request.params || new HttpParams();
    finalOptions.request.headers = finalOptions.request.headers || new HttpHeaders();

    const request: HttpRequest<object> = new HttpRequest<object>(
      finalOptions.request.method as any,
      `${ this.config.apiBaseUrl }${ finalOptions.request.uri }`,
      {
        params: finalOptions.request.params,
        headers: finalOptions.request.headers,
      },
    );

    return this.httpClient.request(request)
      .pipe(
        filter((event: HttpEvent<any>) => event.type === HttpEventType.Response),
        map((response: HttpResponse<any>) => response.body),
        switchMap((body: object) => this.serializer.denormalize(body, this.target as Function, {direction: 'output'})),
        share(),
      );
  }

  getCollection(options?: ResourceServiceOptions): Observable<any> {
    const finalOptions = Object.assign({}, options || {});
    finalOptions.request = finalOptions.request || {};
    finalOptions.request.method = finalOptions.request.method || 'GET';
    finalOptions.request.uri = finalOptions.request.uri || `/${ this.metadata.resource.options.endpoint }`;
    finalOptions.request.params = finalOptions.request.params || new HttpParams();
    finalOptions.request.headers = finalOptions.request.headers || new HttpHeaders();

    const request: HttpRequest<object> = new HttpRequest<object>(
      finalOptions.request.method as any,
      `${ this.config.apiBaseUrl }${ finalOptions.request.uri }`,
      {
        params: finalOptions.request.params,
        headers: finalOptions.request.headers,
      },
    );

    return this.httpClient.request(request)
      .pipe(
        filter((event: HttpEvent<any>) => event.type === HttpEventType.Response),
        map((response: HttpResponse<any>) => response.body),
        switchMap((body: object) => this.serializer.denormalize(body, this.target as Function, {direction: 'output'})),
        share(),
      );
  }

  persist(resource: TResource, options?: ResourceServiceOptions): Observable<TResource> {
    return this.serializer.normalize(resource, {direction: 'input'})
      .pipe(
        switchMap((body) => {
          const identifierMetadata = getIdentifierMetadata(resource.constructor);
          let identifier: string = resource[identifierMetadata.propertyName];

          // Handle IRI
          if (typeof identifier === 'string' && identifier.startsWith(`/${ this.metadata.resource.options.endpoint }/`)) {
            identifier = identifier.substring(`/${ this.metadata.resource.options.endpoint }/`.length);
          }

          const finalOptions = Object.assign({}, options || {});
          finalOptions.request = finalOptions.request || {};
          finalOptions.request.method = finalOptions.request.method || (identifier ? 'PUT' : 'POST');
          finalOptions.request.uri = finalOptions.request.uri || (
            identifier ? `/${ this.metadata.resource.options.endpoint }/${ identifier }` : `/${ this.metadata.resource.options.endpoint }`
          );
          finalOptions.request.params = finalOptions.request.params || new HttpParams();
          finalOptions.request.headers = finalOptions.request.headers || new HttpHeaders();

          const request: HttpRequest<object> = new HttpRequest<object>(
            finalOptions.request.method as any,
            `${ this.config.apiBaseUrl }${ finalOptions.request.uri }`,
            body,
            {
              params: finalOptions.request.params,
              headers: finalOptions.request.headers,
            },
          );

          return this.httpClient.request(request);
        }),
        filter((event: HttpEvent<any>) => event.type === HttpEventType.Response),
        map((response: HttpResponse<any>) => response.body),
        switchMap((body: object) => this.serializer.denormalize(body, this.target as Function, {direction: 'output'})),
        share(),
      );
  }

  delete(resource: TResource, options?: ResourceServiceOptions): Observable<void> {
    const identifierMetadata = getIdentifierMetadata(resource.constructor);
    let identifier: string = resource[identifierMetadata.propertyName];

    // Handle IRI
    if (typeof identifier === 'string' && identifier.startsWith(`/${ this.metadata.resource.options.endpoint }/`)) {
      identifier = identifier.substring(`/${ this.metadata.resource.options.endpoint }/`.length);
    }

    const finalOptions = Object.assign({}, options || {});
    finalOptions.request = finalOptions.request || {};
    finalOptions.request.method = finalOptions.request.method || 'DELETE';
    finalOptions.request.uri = finalOptions.request.uri || `/${ this.metadata.resource.options.endpoint }/${ identifier }`;
    finalOptions.request.params = finalOptions.request.params || new HttpParams();
    finalOptions.request.headers = finalOptions.request.headers || new HttpHeaders();

    const request: HttpRequest<object> = new HttpRequest<object>(
      finalOptions.request.method as any,
      `${ this.config.apiBaseUrl }${ finalOptions.request.uri }`,
      {
        params: finalOptions.request.params,
        headers: finalOptions.request.headers,
      },
    );

    return this.httpClient.request(request)
      .pipe(
        filter((event: HttpEvent<any>) => event.type === HttpEventType.Response),
        mapTo(null),
        share(),
      );
  }
}
