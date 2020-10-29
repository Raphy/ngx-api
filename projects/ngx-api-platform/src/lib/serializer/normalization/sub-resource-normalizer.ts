import { Injectable, Injector, Type } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Denormalizer, DenormalizerContext } from './denormalizer';
import { Normalizer, NormalizerContext } from './normalizer';
import { ResourceService, ResourceServiceTokenFor } from '../../resource-service';
import { getIdentifierMetadata, getResourceMetadata, getSubResourceMetadata } from '../../utilities/metadata';

@Injectable()
export class SubResourceNormalizer implements Normalizer, Denormalizer {
  constructor(private injector: Injector) {
  }

  private getResourceService(type: Type<any>): ResourceService<any> {
    return this.injector.get<ResourceService<any>>(ResourceServiceTokenFor(type as Type<any>));
  }

  denormalize(value: object, type: Function, context?: DenormalizerContext): Observable<any> {
    const subResourceMetadata = getSubResourceMetadata(context.type as Type<any>, context.propertyName);

    const resourceServiceOptions = typeof subResourceMetadata.options.resourceServiceOptions === 'function'
      ? subResourceMetadata.options.resourceServiceOptions(context.value)
      : subResourceMetadata.options.resourceServiceOptions;

    return of(this.getResourceService(type as Type<any>).getResource(value as any, resourceServiceOptions));
  }

  normalize(value: Object, type: Function, context?: NormalizerContext): Observable<any> {
    return (value instanceof Observable ? value as Observable<Object> : of(value))
      .pipe(
        map((resource: Object) => {
          const identifierMetadata = getIdentifierMetadata(type as Type<any>);

          // TODO: handle IRI

          return resource[identifierMetadata.propertyName] as any;
        }),
      )
      ;
  }

  supportsDenormalization(value: any, type: Function, context?: DenormalizerContext): boolean {
    return !!value
      && Object(value) !== value
      && !!getResourceMetadata(type as Type<any>)
      && context
      && context.type
      && context.propertyName
      && !!getSubResourceMetadata(context.type as Type<any>, context.propertyName)
      ;
  }

  supportsNormalization(value: any, type: Function, context ?: NormalizerContext): boolean {
    return !!value
      && (value instanceof type || value instanceof Observable)
      && !!getResourceMetadata(type as Type<any>)
      && context
      && context.type
      && context.propertyName
      && !!getSubResourceMetadata(context.type as Type<any>, context.propertyName)
      ;
  }
}
