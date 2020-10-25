import { HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { getContentType } from '../utils';
import { AbstractFormat } from './abstract-format';

export type JsonCollection<TResource extends object> = Array<TResource>;

@Injectable()
export class JsonFormat extends AbstractFormat {
  deserializeCollection<TResource extends object>(Class: Function, body: object): Observable<Array<TResource>> {
    return of(body)
      .pipe(
        switchMap((body: Array<object>) => {
          if (body.length === 0) {
            return of([]);
          }

          return forkJoin(body.map((resourceBody: object) => this.denormalizeItem<TResource>(Class, resourceBody)))
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
