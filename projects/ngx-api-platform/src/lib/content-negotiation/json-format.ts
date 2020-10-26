import { HttpRequest, HttpResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { API_PLATFORM_DENORMALIZERS, API_PLATFORM_NORMALIZERS, Denormalizer, Normalizer } from '../normalizers';
import { getContentType } from '../utils';
import { AbstractFormat } from './abstract-format';

export type JsonCollection<TResource extends object> = Array<TResource>;

@Injectable()
export class JsonFormat extends AbstractFormat {
  constructor(
    @Inject(API_PLATFORM_DENORMALIZERS) protected denormalizers: Array<Denormalizer>,
    @Inject(API_PLATFORM_NORMALIZERS) protected normalizers: Array<Normalizer>,
  ) {
    super(denormalizers, normalizers);
  }

  deserializeCollection<TResource extends object>(Class: Function, body: object): Observable<Array<TResource>> {
    return of(body)
      .pipe(
        switchMap((bodyJsonCollection: Array<object>) => {
          if (bodyJsonCollection.length === 0) {
            return of([]);
          }

          return forkJoin(bodyJsonCollection.map((resourceBody: object) => this.denormalizeItem<TResource>(Class, resourceBody)))
            .pipe(
              map((collection: Array<TResource>) => collection),
            );
        }),
      )
      ;
  }

  configureRequest(request: HttpRequest<any>): HttpRequest<any> {
    return request.clone({setHeaders: {Accept: 'application/json'}});
  }

  supportsResponse(response: HttpResponse<any>): boolean {
    return getContentType(response) === 'application/json';
  }
}
