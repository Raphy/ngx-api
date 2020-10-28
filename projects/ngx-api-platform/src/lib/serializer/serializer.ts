import { Inject, Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { SerializerError } from './errors/serializer-error';
import { API_PLATFORM_DENORMALIZERS, Denormalizer } from './normalization/denormalizer';
import { API_PLATFORM_NORMALIZERS, Normalizer } from './normalization/normalizer';

@Injectable()
export class Serializer implements Normalizer, Denormalizer {
  constructor(
    @Inject(API_PLATFORM_NORMALIZERS) private normalizers: Array<Normalizer>,
    @Inject(API_PLATFORM_DENORMALIZERS) private denormalizers: Array<Denormalizer>,
  ) {
    console.log(`[${ this.constructor.name }]`, {normalizers, denormalizers});
  }

  // object
  // string
  // number
  // ...
  // array

  denormalize(value: any, type: Function): Observable<any> {
    console.log(`[${ this.constructor.name }::denormalize()]`, {value, type});

    const denormalizer = this.getDenormalizer(value, type);
    if (denormalizer) {
      return denormalizer.denormalize(value, type);
    }

    if (Object(value) !== value) {
      return of(value);
    }

    if (type === Object) {
      const denormalized = {};
      const denormalizationObservables = [];
      for (const propertyName in value) {
        if (value.hasOwnProperty(propertyName)) {
          const denormalizationObservable = this.denormalize(value[propertyName], value[propertyName].constructor);
          denormalizationObservables.push(
            denormalizationObservable.pipe(tap((denormalizedChild) => denormalized[propertyName] = denormalizedChild)),
          );
        }
      }

      return denormalizationObservables.length > 0
        ? forkJoin(denormalizationObservables).pipe(map(() => denormalized))
        : of(denormalized);
    }

    if (type === Array) {
      const denormalized = [];
      const denormalizationObservables = [];
      for (const item of value) {
        const denormalizationObservable = this.denormalize(item, item.constructor);
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

  normalize(value: any, type: Function): Observable<any> {
    console.log(`[${ this.constructor.name }::normalize()]`, {value, type});

    const normalizer = this.getNormalizer(value, type);
    if (normalizer) {
      return normalizer.normalize(value, type);
    }

    if (Object(value) !== value) {
      return of(value);
    }

    if (type === Object) {
      const normalized = {};
      const normalizationObservables = [];
      for (const propertyName in value) {
        if (value.hasOwnProperty(propertyName)) {
          const normalizationObservable = this.normalize(value[propertyName], value[propertyName].constructor);
          normalizationObservables.push(
            normalizationObservable.pipe(tap((normalizedChild) => normalized[propertyName] = normalizedChild)),
          );
        }
      }

      return normalizationObservables.length > 0
        ? forkJoin(normalizationObservables).pipe(map(() => normalized))
        : of(normalized);
    }

    if (type === Array) {
      const normalized = [];
      const normalizationObservables = [];
      for (const item of value) {
        const normalizationObservable = this.normalize(item, item.constructor);
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

  supportsDenormalization(value: any, type: Function): boolean {
    return !!this.getDenormalizer(value, type);
  }

  supportsNormalization(value: any, type: Function): boolean {
    return !!this.getNormalizer(value, type);
  }

  private getNormalizer(value: any, type: Function): Normalizer {
    for (const normalizer of this.normalizers) {
      if (normalizer.supportsNormalization(value, type)) {
        return normalizer;
      }
    }

    return undefined;
  }


  private getDenormalizer(value: any, type: Function): Denormalizer {
    for (const denormalizer of this.denormalizers) {
      if (denormalizer.supportsDenormalization(value, type)) {
        return denormalizer;
      }
    }

    return undefined;
  }
}
