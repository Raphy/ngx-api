import { Injectable, Injector, Type } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Denormalizer } from './denormalizer';
import { Normalizer } from './normalizer';
import { Serializer } from '../serializer';
import {
  getInputsMetadata,
  getOutputsMetadata,
  getPropertyMetadata,
  getResourceMetadata,
  getSubResourceMetadata,
} from '../../utilities/metadata';

@Injectable()
export class ResourceNormalizer implements Normalizer, Denormalizer {
  private get serializer(): Serializer {
    return this.injector.get(Serializer);
  }

  constructor(private injector: Injector) {
  }

  denormalize(value: object, type: Function): Observable<any> {
    const resource = Reflect.construct(type, []);
    const denormalizationObservables = [];

    const outputsMetadata = getOutputsMetadata(type as Type<any>);
    for (const outputMetadata of outputsMetadata) {
      const propertyMetadata = getPropertyMetadata(type as Type<any>, outputMetadata.propertyName);
      const subResourceMetadata = getSubResourceMetadata(type as Type<any>, outputMetadata.propertyName);

      denormalizationObservables.push(
        this.serializer.denormalize(
          value[propertyMetadata.options.name],
          subResourceMetadata ? subResourceMetadata.options.type() as Function : propertyMetadata.options.type,
        )
          .pipe(
            tap((denormalizedChild) => resource[propertyMetadata.propertyName] = denormalizedChild),
          ),
      );
    }

    return denormalizationObservables.length > 0
      ? forkJoin(denormalizationObservables).pipe(map(() => resource))
      : of(resource);
  }

  normalize(value: Type<any>, type: Function): Observable<object> {
    const object = {};
    const normalizationObservables = [];

    const inputsMetadata = getInputsMetadata(type as Type<any>);
    for (const inputMetadata of inputsMetadata) {
      const propertyMetadata = getPropertyMetadata(type as Type<any>, inputMetadata.propertyName);
      const subResourceMetadata = getSubResourceMetadata(type as Type<any>, inputMetadata.propertyName);

      normalizationObservables.push(
        this.serializer.normalize(
          value[propertyMetadata.propertyName],
          subResourceMetadata ? subResourceMetadata.options.type() as Function : propertyMetadata.options.type,
        )
          .pipe(
            tap((normalizedChild) => object[propertyMetadata.options.name] = normalizedChild),
          ),
      );
    }

    return normalizationObservables.length > 0
      ? forkJoin(normalizationObservables).pipe(map(() => object))
      : of(object);
  }

  supportsDenormalization(value: any, type: Function): boolean {
    return !!value && typeof value === 'object' && !!getResourceMetadata(type as Type<any>);
  }

  supportsNormalization(value: any, type: Function): boolean {
    return !!value && value instanceof type && !!getResourceMetadata(type as Type<any>);
  }
}
