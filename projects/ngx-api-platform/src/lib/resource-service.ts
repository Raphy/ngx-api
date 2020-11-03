import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpParams, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable, InjectionToken, Injector } from '@angular/core';
import { Observable, of } from 'rxjs';
import { filter, map, share, switchMap } from 'rxjs/operators';
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
    options = options || {};
    options.request = options.request || {};
    options.request.method = options.request.method || 'GET';
    options.request.uri = options.request.uri || `/${ this.metadata.resource.options.endpoint }/${ identifier }`;
    options.request.params = options.request.params || new HttpParams();
    options.request.headers = options.request.headers || new HttpHeaders();

    // TODO: handle IRI

    const request: HttpRequest<object> = new HttpRequest<object>(
      options.request.method as any,
      `${ this.config.apiBaseUrl }${ options.request.uri }`,
      {
        params: options.request.params,
        headers: options.request.headers,
      },
    );

    return this.httpClient.request(request)
      .pipe(
        filter((event: HttpEvent<any>) => event.type === HttpEventType.Response),
        map((response: HttpResponse<any>) => response.body),
        switchMap((body: object) => this.serializer.denormalize(body, this.target as Function)),
        share(),
      )
      ;
  }

  getCollection(options?: ResourceServiceOptions): Observable<any> {
    options = options || {};
    options.request = options.request || {};
    options.request.method = options.request.method || 'GET';
    options.request.uri = options.request.uri || `/${ this.metadata.resource.options.endpoint }`;
    options.request.params = options.request.params || new HttpParams();
    options.request.headers = options.request.headers || new HttpHeaders();

    const request: HttpRequest<object> = new HttpRequest<object>(
      options.request.method as any,
      `${ this.config.apiBaseUrl }${ options.request.uri }`,
      {
        params: options.request.params,
        headers: options.request.headers,
      },
    );

    return this.httpClient.request(request)
      .pipe(
        filter((event: HttpEvent<any>) => event.type === HttpEventType.Response),
        map((response: HttpResponse<any>) => response.body),
        switchMap((body: object) => this.serializer.denormalize(body, this.target as Function)),
        share(),
      )
      ;
  }

  persist(resource: TResource, options?: ResourceServiceOptions): Observable<TResource> {
    return of(null);
  }

  delete(resource: TResource, options?: ResourceServiceOptions): Observable<void> {
    return of(null);
  }
}
