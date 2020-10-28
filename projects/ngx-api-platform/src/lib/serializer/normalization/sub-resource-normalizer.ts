import { Injectable, Injector, Type } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Denormalizer } from './denormalizer';
import { Normalizer } from './normalizer';
import { getIdentifierMetadata, getResourceMetadata } from '../../mapping/utilities/metadata';
import { ResourceService, ResourceServiceTokenFor } from '../../resource-service';

@Injectable()
export class SubResourceNormalizer implements Normalizer, Denormalizer {
  constructor(private injector: Injector) {
  }

  denormalize(value: object, type: Function): Observable<any> {
    console.log(`[${ this.constructor.name }::denormalize()]`, {value, type});
    return of(this.injector.get<ResourceService<any>>(ResourceServiceTokenFor(type as Type<any>))
      .getResource(value as any))
      ;
  }

  normalize(value: Type<any>, type: Function): Observable<any> {
    console.log(`[${ this.constructor.name }::normalize()]`, {value, type});


    return ((value instanceof Observable ? value as Observable<object> : of(value)) as Observable<object>)
      .pipe(
        map((resource: object) => {
          const resourceMetadata = getResourceMetadata(type as Type<any>);
          const identifierMetadata = getIdentifierMetadata(type as Type<any>);

          return `/${ resourceMetadata.options.endpoint }/${ resource[identifierMetadata.propertyName] }`;
        }),
      )
    ;
  }

  supportsDenormalization(value: any, type: Function): boolean {
    return !!value && Object(value) !== value && !!getResourceMetadata(type as Type<any>);
  }

  supportsNormalization(value: any, type: Function): boolean {
    return !!value && (value instanceof type || value instanceof Observable) && !!getResourceMetadata(type as Type<any>);
  }
}
