import { Injectable, Injector } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ApiServiceTokenFor } from '../api-service';
import { getResourceEndpoint, getResourceIdentifier, getSubCollectionMetadata } from '../utils';
import { Denormalizer, DenormalizerContext } from './denormalizer';
import { NormalizerContext } from './normalizer';

@Injectable()
export class SubCollectionDenormalizer implements Denormalizer {
  constructor(private injector: Injector) {
  }

  denormalize(value: any, type: () => Function, context: DenormalizerContext): Observable<any> {
    const subCollectionMetadata = getSubCollectionMetadata(context.ResourceClass, context.propertyName);
    const apiServiceCollectionOptions = typeof subCollectionMetadata.options.apiServiceCollectionOptions === 'function'
      ? subCollectionMetadata.options.apiServiceCollectionOptions(context.resource)
      : subCollectionMetadata.options.apiServiceCollectionOptions || {};
    apiServiceCollectionOptions.forceEndpoint = apiServiceCollectionOptions.forceEndpoint
      || `${ getResourceEndpoint(context.ResourceClass) }/${ getResourceIdentifier(context.resource) }/${ context.propertyName }`;

    const subCollectionObservable = this.injector.get(ApiServiceTokenFor(subCollectionMetadata.options.SubResourceClass))
      .getCollection(apiServiceCollectionOptions)
    ;

    return of(subCollectionObservable);
  }

  supports(type: () => Function, context: NormalizerContext): boolean {
    return !!getSubCollectionMetadata(context.ResourceClass, context.propertyName);
  }
}
