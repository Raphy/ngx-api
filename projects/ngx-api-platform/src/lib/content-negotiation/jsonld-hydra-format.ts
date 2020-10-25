import { HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { getContentType } from '../utils';
import { AbstractFormat } from './abstract-format';
import { JsonCollection } from './json-format';

export interface HydraCollection<TResource extends object> {
  'hydra:member': JsonCollection<TResource>;
}

@Injectable()
export class JsonldHydraFormat extends AbstractFormat {
  deserializeCollection<TResource extends object>(Class: Function, body: object): Observable<HydraCollection<TResource>> {
    return of(body as HydraCollection<TResource>);
  }

  deserializeItem<TResource extends object>(Class: Function, body: object): Observable<TResource> {
    return of(body as TResource);
  }

  serializeItem<TResource extends object>(Class: Function, resource: TResource): Observable<object> {
    return of({});
  }

  configureRequest(request: HttpRequest<any>): HttpRequest<any> {
    return request.clone({setHeaders: {Accept: 'application/ld+json'}});
  }

  supportsResponse(response: HttpResponse<any>): boolean {
    return getContentType(response) === 'application/ld+json';
  }
}
