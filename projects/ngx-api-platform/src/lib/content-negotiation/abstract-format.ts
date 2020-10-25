import { HttpRequest, HttpResponse } from '@angular/common/http';
import { Inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { API_PLATFORM_DENORMALIZERS, API_PLATFORM_NORMALIZERS, Denormalizer, Normalizer } from '../normalizer';
import { Format } from './format';

export abstract class AbstractFormat implements Format {
  constructor(
    @Inject(API_PLATFORM_DENORMALIZERS) protected denormalizers: Array<Denormalizer>,
    @Inject(API_PLATFORM_NORMALIZERS) protected normalizers: Array<Normalizer>,
  ) {
  }

  abstract configureRequest(request: HttpRequest<any>): HttpRequest<any>;

  abstract deserializeCollection<TResource extends object>(Class: Function, body: object): Observable<any>;

  deserializeItem<TResource extends object>(Class: Function, body: object): Observable<TResource> {
    return this.denormalizeItem<TResource>(Class, body);
  }

  serializeItem<TResource extends object>(Class: Function, resource: TResource): Observable<object> {
    return this.normalizeItem<TResource>(Class, resource);
  }
  abstract supportsResponse(response: HttpResponse<any>): boolean;

  protected normalizeItem<TResource extends object>(Class: Function, resource: TResource): Observable<object> {
    return of(resource);
  }

  protected denormalizeItem<TResource extends object>(Class: Function, body: object): Observable<TResource> {
    return of(body as any);
  }
}
