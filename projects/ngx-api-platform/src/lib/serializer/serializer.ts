import { Inject, Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { SerializerError } from './errors/serializer-error';
import { API_PLATFORM_DENORMALIZERS, Denormalizer, DenormalizerContext } from './normalization/denormalizer';
import { API_PLATFORM_NORMALIZERS, Normalizer, NormalizerContext } from './normalization/normalizer';

@Injectable()
export class Serializer implements Normalizer, Denormalizer {
  constructor(
    @Inject(API_PLATFORM_NORMALIZERS) private normalizers: Array<Normalizer>,
    @Inject(API_PLATFORM_DENORMALIZERS) private denormalizers: Array<Denormalizer>,
  ) {
  }

  denormalize(value: any, type: Function, context?: DenormalizerContext): Observable<any> {
    context = context || {};

    const denormalizer = this.getDenormalizer(value, type, context);
    if (denormalizer) {
      return denormalizer.denormalize(value, type, context);
    }

    if (Object(value) !== value) {
      return of(value);
    }

    if (value.constructor === Object || type === Object) {
      const denormalized = {};
      const denormalizationObservables = [];
      for (const propertyName in value) {
        if (value.hasOwnProperty(propertyName)) {
          const denormalizationObservable = this.denormalize(
            value[propertyName],
            value[propertyName].constructor,
            {
              parentContext: context,
              value,
              type,
              propertyName,
            },
          );
          denormalizationObservables.push(
            denormalizationObservable.pipe(tap((denormalizedChild) => denormalized[propertyName] = denormalizedChild)),
          );
        }
      }

      return denormalizationObservables.length > 0
        ? forkJoin(denormalizationObservables).pipe(map(() => denormalized))
        : of(denormalized);
    }

    if (value.constructor === Array || type === Array) {
      const denormalized = [];
      const denormalizationObservables = [];
      for (const item of value) {
        const denormalizationObservable = this.denormalize(
          item,
          type,
          {
            parentContext: context,
            value,
            type,
          },
        );
        denormalizationObservables.push(
          denormalizationObservable.pipe(tap((denormalizedChild) => denormalized.push(denormalizedChild))),
        );
      }

      return denormalizationObservables.length > 0
        ? forkJoin(denormalizationObservables).pipe(map(() => denormalized))
        : of(denormalized);
    }

    throw new SerializerError(`The value of type "${ type.name }" could not be denormalized because no supporting denormalizer found`);
  }

  normalize(value: any, type: Function, context?: NormalizerContext): Observable<any> {
    context = context || {};

    console.log('Serializer::normalize', {value, type, context});

    const normalizer = this.getNormalizer(value, type, context);
    if (normalizer) {
      return normalizer.normalize(value, type, context);
    }

    if (Object(value) !== value) {
      return of(value);
    }

    if (value.constructor === Object || type === Object) {
      const normalized = {};
      const normalizationObservables = [];
      for (const propertyName in value) {
        if (value.hasOwnProperty(propertyName)) {
          const normalizationObservable = this.normalize(
            value[propertyName],
            value[propertyName].constructor,
            {
              parentContext: context,
              value,
              type,
              propertyName,
            },
          );
          normalizationObservables.push(
            normalizationObservable.pipe(tap((normalizedChild) => normalized[propertyName] = normalizedChild)),
          );
        }
      }

      return normalizationObservables.length > 0
        ? forkJoin(normalizationObservables).pipe(map(() => normalized))
        : of(normalized);
    }

    if (value.constructor === Array || type === Array) {
      const normalized = [];
      const normalizationObservables = [];
      for (const item of value) {
        const normalizationObservable = this.normalize(
          item,
          item.constructor,
          {
            parentContext: context,
            value,
            type,
          },
        );
        normalizationObservables.push(
          normalizationObservable.pipe(tap((normalizedChild) => normalized.push(normalizedChild))),
        );
      }

      return normalizationObservables.length > 0
        ? forkJoin(normalizationObservables).pipe(map(() => normalized))
        : of(normalized);
    }

    throw new SerializerError(`The value of type "${ type.name }" could not be normalized because no supporting normalizer found`);
  }

  supportsDenormalization(value: any, type: Function, context?: DenormalizerContext): boolean {
    return !!this.getDenormalizer(value, type, context);
  }

  supportsNormalization(value: any, type: Function, context?: NormalizerContext): boolean {
    return !!this.getNormalizer(value, type, context);
  }

  private getNormalizer(value: any, type: Function, context?: NormalizerContext): Normalizer {
    for (const normalizer of this.normalizers) {
      if (normalizer.supportsNormalization(value, type, context)) {
        return normalizer;
      }
    }

    return undefined;
  }

  private getDenormalizer(value: any, type: Function, context?: DenormalizerContext): Denormalizer {
    for (const denormalizer of this.denormalizers) {
      if (denormalizer.supportsDenormalization(value, type, context)) {
        return denormalizer;
      }
    }

    return undefined;
  }
}
