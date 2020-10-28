import { HttpClient } from '@angular/common/http';
import { Injectable, InjectionToken, Injector, Type } from '@angular/core';
import { Observable, of } from 'rxjs';
import { API_PLATFORM_CONFIG, ApiPlatformConfig } from './api-platform-config';
import {
  getIdentifierMetadata,
  getInputsMetadata,
  getOutputsMetadata,
  getPropertiesMetadata,
  getResourceMetadata,
  getSubCollectionsMetadata,
  getSubResourcesMetadata,
  validateMetadata,
} from './mapping/utilities/metadata';
import { ResourceServiceOptions } from './resource-service-options';

/**
 * Stores the InjectionToken instances because they need to be "unique" across the application.
 */
const injectionTokens: { [description: string]: InjectionToken<any> } = {};

export function ResourceServiceTokenFor<TResource>(target: Type<TResource>): InjectionToken<TResource> {
  const description = `API_PLATFORM_RESOURCE_SERVICE_${ target.name }`;
  if (!injectionTokens.hasOwnProperty(description)) {
    injectionTokens[description] = new InjectionToken<TResource>(description);
  }

  return injectionTokens[description];
}

export function resourceServiceFactory<TResource>(target: Type<TResource>): Function {
  return (injector: Injector) => new ResourceService<TResource>(target, injector);
}

@Injectable()
export class ResourceService<TResource> {
  constructor(private target: Type<TResource>, private injector: Injector) {
    if (this.config.resourceMappingValidation === 'enabled') {
      validateMetadata(target);
    }

    console.log(
      `${ this.constructor.name }`,
      {
        target,
        resource: getResourceMetadata(target),
        properties: getPropertiesMetadata(target),
        subResources: getSubResourcesMetadata(target),
        subCollections: getSubCollectionsMetadata(target),
        identifier: getIdentifierMetadata(target),
        inputs: getInputsMetadata(target),
        outputs: getOutputsMetadata(target),
      });
  }

  private get config(): ApiPlatformConfig {
    return this.injector.get<ApiPlatformConfig>(API_PLATFORM_CONFIG);
  }

  private get httpClient(): HttpClient {
    return this.injector.get<HttpClient>(HttpClient);
  }

  getResource(identifierOrIri: string | number, options?: ResourceServiceOptions): Observable<TResource> {
    return of({id: identifierOrIri} as any);
  }

  getCollection(options?: ResourceServiceOptions): Observable<any> {
    return of(null);
  }

  persist(resource: TResource, options?: ResourceServiceOptions): Observable<TResource> {
    return of(null);
  }

  delete(resource: TResource, options?: ResourceServiceOptions): Observable<void> {
    return of(null);
  }
}
