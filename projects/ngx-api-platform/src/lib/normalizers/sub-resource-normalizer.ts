import { Injectable, Injector } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { ApiServiceTokenFor } from '../api-service';
import { getResourceIdentifier, getSubResourceMetadata } from '../utils';
import { Denormalizer, DenormalizerContext } from './denormalizer';
import { Normalizer, NormalizerContext } from './normalizer';

@Injectable()
export class SubResourceNormalizer implements Normalizer, Denormalizer {
  constructor(private injector: Injector) {
  }

  denormalize(value: any, type: () => Function, context: DenormalizerContext): Observable<any> {
    const subResourceMetadata = getSubResourceMetadata(context.ResourceClass, context.propertyName);
    const apiServiceItemOptions = typeof subResourceMetadata.options.apiServiceItemOptions === 'function'
      ? subResourceMetadata.options.apiServiceItemOptions(context.resource)
      : subResourceMetadata.options.apiServiceItemOptions || {};

    const subResourceObservable = this.injector.get(ApiServiceTokenFor(subResourceMetadata.options.SubResourceClass))
      .getItem(value, apiServiceItemOptions)
    ;

    if ((type as any) === Observable) {
      return of(subResourceObservable);
    }

    return subResourceObservable;
  }

  normalize(value: any, type: () => Function, context: NormalizerContext): Observable<any> {
    return ((type as any) === Observable ? value : of(value))
      .pipe(
        map((subResource) => getResourceIdentifier(subResource))
      )
      ;
  }

  supports(type: () => Function, context: NormalizerContext): boolean {
    return !!getSubResourceMetadata(context.ResourceClass, context.propertyName);
  }
}
