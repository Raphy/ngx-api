import { Inject, Injectable } from '@angular/core';
import { forkJoin, Observable, of, throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { SerializerError } from './errors';
import { API_PLATFORM_DENORMALIZERS, API_PLATFORM_NORMALIZERS, Denormalizer, Normalizer } from './normalizers';

@Injectable()
export class Serializer implements Denormalizer, Normalizer {
  constructor(
    @Inject(API_PLATFORM_NORMALIZERS) private normalizers: Array<Normalizer>,
    @Inject(API_PLATFORM_DENORMALIZERS) private denormalizers: Array<Denormalizer>,
  ) {
  }

  denormalize(value: any, type: Function, context?: object): Observable<any> {
    return this.getDenormalizer(value, type)
      .pipe(
        switchMap((denormalizer) => {
          if (value.constructor === Array) {
            return this.denormalizeArray(value, context);
          }

          // If the value is a native type, just return it
          if (Object(value) !== value) {
            return of(value);
          }

          // If a denormalizer is found, use it
          if (denormalizer) {
            return denormalizer.denormalize(value, type, context);
          }

          if (value.constructor === Object) {
            return this.denormalizeObject(value, context);
          }

          console.error(`${ this.constructor.name }::denormalize / Any denormalizer found`, {value, type, context});

          return throwError(new SerializerError('Any denormalizer found'));
        }),
      )
      ;
  }

  normalize(value: any, context?: object): Observable<any> {
    return this.getNormalizer(value)
      .pipe(
        switchMap((normalizer) => {
          if (value.constructor === Array) {
            return this.normalizeArray(value, context);
          }

          // If a normalizer is found, use it
          if (normalizer) {
            return normalizer.normalize(value, context);
          }

          // If the value is a native type, just return it
          if (Object(value) !== value) {
            return of(value);
          }

          if (value.constructor === Object) {
            return this.normalizeObject(value, context);
          }

          console.error(`${ this.constructor.name }::normalize / Any normalizer found`, {value, context});

          return throwError(new SerializerError('Any normalizer found'));
        }),
      )
      ;
  }

  supportsDenormalization(value: any, type: Function): Observable<boolean> {
    return this.getDenormalizer(value, type).pipe(map((denormalizer) => !!denormalizer));
  }

  supportsNormalization(value: any): Observable<boolean> {
    return this.getNormalizer(value).pipe(map((normalizer) => !!normalizer));
  }

  private getDenormalizer(value: any, type: Function): Observable<Denormalizer> {
    return of(this.denormalizers)
      .pipe(
        switchMap(
          (denormalizers) => forkJoin(
            denormalizers.map(
              (denormalizer) => denormalizer.supportsDenormalization(value, type).pipe(map((supports) => supports ? denormalizer : null)),
            ),
          ),
        ),
        map((denormalizers) => denormalizers.reduce((acc, curr) => curr || acc, null)),
      );
  }

  private getNormalizer(value: any): Observable<Normalizer> {
    return of(this.normalizers)
      .pipe(
        switchMap(
          (normalizers) => forkJoin(
            normalizers.map(
              (normalizer) => normalizer.supportsNormalization(value).pipe(map((supports) => supports ? normalizer : null)),
            ),
          ),
        ),
        map((normalizers) => normalizers.reduce((acc, curr) => curr || acc, null)),
      );
  }

  private denormalizeArray(array: Array<any>, context?: object): Observable<Array<any>> {
    return array.length === 0
      ? of([])
      : forkJoin(array.map((item) => this.denormalize(item, item.constructor, context)));
  }

  private denormalizeObject(object: Object, context?: object): Observable<Object> {
    const propertyNames = Object.keys(object);
    const denormalizedObject = {};

    return propertyNames.length === 0
      ? of({})
      : forkJoin(propertyNames.map(
        (propertyName) => this.denormalize(object[propertyName], object[propertyName].constructor, context)
          .pipe(map((denormalizedValue) => denormalizedObject[propertyName] = denormalizedValue)),
      ))
        .pipe(map(() => denormalizedObject))
      ;
  }

  private normalizeArray(array: Array<any>, context?: object): Observable<Array<any>> {
    return array.length === 0
      ? of([])
      : forkJoin(array.map((item) => this.normalize(item, context)));
  }

  private normalizeObject(object: Object, context?: object): Observable<Object> {
    const propertyNames = Object.keys(object);
    const normalizedObject = {};

    return propertyNames.length === 0
      ? of({})
      : forkJoin(propertyNames.map(
        (propertyName) => this.normalize(object[propertyName], context)
          .pipe(map((normalizedValue) => normalizedObject[propertyName] = normalizedValue)),
      ))
        .pipe(map(() => normalizedObject))
      ;
  }
}
