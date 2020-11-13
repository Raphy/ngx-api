import { Inject, Injectable } from '@angular/core';
import { forkJoin, Observable, of, throwError } from 'rxjs';
import { map, mapTo, switchMap } from 'rxjs/operators';
import { SerializerError } from './errors';
import { API_PLATFORM_DENORMALIZERS, API_PLATFORM_NORMALIZERS, Denormalizer, Normalizer } from './normalizers';

@Injectable()
export class Serializer implements Denormalizer, Normalizer {
  private normalizers: Array<Normalizer>;

  private denormalizers: Array<Denormalizer>;

  constructor(
    @Inject(API_PLATFORM_NORMALIZERS) normalizers: Array<Normalizer>,
    @Inject(API_PLATFORM_DENORMALIZERS) denormalizers: Array<Denormalizer>,
  ) {
    this.normalizers = normalizers.sort((n1, n2) => n1.getNormalizationOrder() - n2.getNormalizationOrder());
    this.denormalizers = denormalizers.sort((dn1, dn2) => dn1.getDenormalizationOrder() - dn2.getDenormalizationOrder());
  }

  denormalize(value: any, type: Function, context?: object): Observable<any> {
    return this.getDenormalizer(value, type)
      .pipe(
        switchMap((denormalizer) => {
          if (!value) {
            return of(value);
          }

          if (value.constructor === Array) {
            return this.denormalizeArray(value, type, context);
          }

          // If a denormalizer is found, use it
          if (denormalizer) {
            return denormalizer.denormalize(value, type, context);
          }

          // If the value is a native type, just return it
          if (Object(value) !== value) {
            return of(value);
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
          if (!value) {
            return of(value);
          }

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

  getDenormalizationOrder(): number {
    return 0;
  }

  getNormalizationOrder(): number {
    return 0;
  }

  private getDenormalizer(value: any, type: Function): Observable<Denormalizer> {
    return of(this.denormalizers)
      .pipe(
        switchMap(
          (denormalizers: Array<Denormalizer>) => forkJoin(
            denormalizers.map(
              (denormalizer) => denormalizer.supportsDenormalization(value, type).pipe(map((supports) => supports ? denormalizer : null)),
            ),
          ),
        ),
        map((denormalizers: Array<Denormalizer>) => denormalizers.filter((denormalizer) => !!denormalizer)),
        map((denormalizers: Array<Denormalizer>) => denormalizers.sort((d1, d2) => d1.getDenormalizationOrder() - d2.getDenormalizationOrder())),
        map((denormalizers: Array<Denormalizer>) => denormalizers.shift()),
      );
  }

  private getNormalizer(value: any): Observable<Normalizer> {
    return of(this.normalizers)
      .pipe(
        switchMap(
          (normalizers: Array<Normalizer>) => forkJoin(
            normalizers.map(
              (normalizer) => normalizer.supportsNormalization(value).pipe(map((supports) => supports ? normalizer : null)),
            ),
          ),
        ),
        map((normalizers: Array<Normalizer>) => normalizers.filter((normalizer) => !!normalizer)),
        map((normalizers: Array<Normalizer>) => normalizers.sort((n1, n2) => n1.getNormalizationOrder() - n2.getNormalizationOrder())),
        map((normalizers: Array<Normalizer>) => normalizers.shift()),
      );
  }

  private denormalizeArray(array: Array<any>, type: Function, context?: object): Observable<Array<any>> {
    return array.length === 0
      ? of([])
      : forkJoin(array.map((item) => this.denormalize(item, type, context)));
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
        .pipe(mapTo(denormalizedObject))
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
        .pipe(mapTo(normalizedObject))
      ;
  }
}
