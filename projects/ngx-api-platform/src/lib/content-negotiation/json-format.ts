import { HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { getContentType } from '../utils';
import { AbstractFormat } from './abstract-format';

export type JsonCollection<TResource extends object> = Array<TResource>;

@Injectable()
export class JsonFormat extends AbstractFormat {
  deserializeCollection<TResource extends object>(Class: Function, body: object): Observable<Array<TResource>> {
    return of(body as Array<TResource>);
  }

  deserializeItem<TResource extends object>(Class: Function, body: object): Observable<TResource> {
    return of(body as TResource);
  }

  serializeItem<TResource extends object>(Class: Function, resource: TResource): Observable<object> {
    return of({});
  }

  configureRequest(request: HttpRequest<any>): HttpRequest<any> {
    return request.clone({setHeaders: {Accept: 'application/json'}});
  }

  supportsResponse(response: HttpResponse<any>): boolean {
    return getContentType(response) === 'application/json';
  }
}
