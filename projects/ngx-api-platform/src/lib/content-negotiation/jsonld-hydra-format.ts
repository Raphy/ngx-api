import { HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { getContentType } from '../utils';
import { AbstractFormat } from './abstract-format';
import { JsonCollection } from './json-format';

export interface HydraCollection<TResource extends object> {
  'hydra:member': JsonCollection<TResource>;
}

@Injectable()
export class JsonldHydraFormat extends AbstractFormat {
  deserializeCollection<TResource extends object>(Class: Function, body: object): Observable<HydraCollection<TResource>> {
    return of(body)
      .pipe(
        switchMap((body: HydraCollection<TResource>) => {
          return forkJoin(body['hydra:member'].map((resourceBody: object) => this.denormalizeItem<TResource>(Class, resourceBody)))
            .pipe(
              tap((collection: Array<TResource>) => body['hydra:member'] = collection),
              map(() => body),
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
