import { HttpRequest, HttpResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { API_PLATFORM_DENORMALIZERS, API_PLATFORM_NORMALIZERS, Denormalizer, Normalizer } from '../normalizers';
import { getContentType } from '../utils';
import { AbstractFormat } from './abstract-format';
import { JsonCollection } from './json-format';

export interface HydraCollection<TResource extends object> {
  'hydra:member': JsonCollection<TResource>;
}

@Injectable()
export class JsonldHydraFormat extends AbstractFormat {
  constructor(
    @Inject(API_PLATFORM_DENORMALIZERS) protected denormalizers: Array<Denormalizer>,
    @Inject(API_PLATFORM_NORMALIZERS) protected normalizers: Array<Normalizer>,
  ) {
    super(denormalizers, normalizers);
  }

  deserializeCollection<TResource extends object>(Class: Function, body: object): Observable<HydraCollection<TResource>> {
    return of(body)
      .pipe(
        switchMap((bodyHydraCollection: HydraCollection<TResource>) => {
          return forkJoin(
            bodyHydraCollection['hydra:member'].map((resourceBody: object) => this.denormalizeItem<TResource>(Class, resourceBody))
          )
            .pipe(
              tap((collection: Array<TResource>) => bodyHydraCollection['hydra:member'] = collection),
              map(() => bodyHydraCollection),
            );
        }),
      )
      ;
  }

  configureRequest(request: HttpRequest<any>): HttpRequest<any> {
    return request.clone({setHeaders: {Accept: 'application/ld+json'}});
  }

  supportsResponse(response: HttpResponse<any>): boolean {
    return getContentType(response) === 'application/ld+json';
  }
}
