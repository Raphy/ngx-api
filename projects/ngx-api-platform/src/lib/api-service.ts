import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpParams, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injector } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { API_PLATFORM_CONFIG, ApiPlatformConfig } from './api-platform-config';
import { API_PLATFORM_DEFAULT_FORMAT, Format } from './content-negotiation';
import { ResourceMetadata } from './metadata';
import { ApiServiceCollectionOptions, ApiServiceDeleteOptions, ApiServiceItemOptions, ApiServicePersistOptions } from './options';
import { getIdentifierFromIri, getResourceEndpoint, getResourceIdentifier, getResourceMetadata, isIri } from './utils';

export function ApiServiceTokenFor(Class: Function): string {
  const resourceMetadata: ResourceMetadata = getResourceMetadata(Class);

  return `API_PLATFORM_API_SERVICE_${ resourceMetadata.Class.name }_${ resourceMetadata.options.endpoint }`;
}

export class ApiService<TResource extends object, TCollection> {
  constructor(
    private Class: Function,
    private injector: Injector,
  ) {
  }

  private get config(): ApiPlatformConfig {
    return this.injector.get<ApiPlatformConfig>(API_PLATFORM_CONFIG);
  }

  private get httpClient(): HttpClient {
    return this.injector.get<HttpClient>(HttpClient);
  }

  private get defaultFormat(): Format {
    return this.injector.get<Format>(API_PLATFORM_DEFAULT_FORMAT);
  }

  getItem(identifierOrIri: string | number, options?: ApiServiceItemOptions): Observable<TResource> {
    options = options || {};
    options.headers = options.headers || {};
    options.params = options.params || {};

    const format = options.format ? this.injector.get<Format>(options.format) : this.defaultFormat;
    const endpoint = getResourceEndpoint(this.Class);
    const identifier = isIri(identifierOrIri) ? getIdentifierFromIri(identifierOrIri as string) : identifierOrIri;

    const request: HttpRequest<TResource> = format.configureRequest(
      new HttpRequest<TResource>(
        'GET',
        `${ this.config.apiBaseUrl }/${ endpoint }/${ identifier }`,
        {
          headers: new HttpHeaders(options.headers),
          params: new HttpParams({fromObject: options.params}),
        },
      ),
    );

    return this.httpClient.request<object>(request)
      .pipe(
        filter((event: HttpEvent<object>) => event.type === HttpEventType.Response),
        switchMap((response: HttpResponse<object>) => {
          if (!format.supportsResponse(response)) {
            return throwError('The Response is not supported by the format.');
          }

          return of(response.body);
        }),
        switchMap((body: object) => format.deserializeItem<TResource>(this.Class, body)),
      )
      ;
  }

  getCollection(options?: ApiServiceCollectionOptions): Observable<TCollection> {
    options = options || {};
    options.headers = options.headers || {};
    options.params = options.params || {};

    const format = options.format ? this.injector.get<Format>(options.format) : this.defaultFormat;
    const endpoint = options.forceEndpoint ? options.forceEndpoint : getResourceEndpoint(this.Class);

    const request: HttpRequest<TResource> = format.configureRequest(
      new HttpRequest<TResource>(
        'GET',
        `${ this.config.apiBaseUrl }/${ endpoint }`,
        {
          headers: new HttpHeaders(options.headers),
          params: new HttpParams({fromObject: options.params}),
        },
      ),
    );

    return this.httpClient.request<object>(request)
      .pipe(
        filter((event: HttpEvent<any>) => event.type === HttpEventType.Response),
        switchMap((response: HttpResponse<object>) => {
          if (!format.supportsResponse(response)) {
            return throwError('The Response is not supported by the format.');
          }

          return of(response.body);
        }),
        switchMap((body: object) => format.deserializeCollection<TResource>(this.Class, body)),
      )
      ;
  }

  persist(resource: TResource, options?: ApiServicePersistOptions): Observable<TResource> {
    options = options || {};
    options.headers = options.headers || {};
    options.params = options.params || {};

    const format = options.format ? this.injector.get<Format>(options.format) : this.defaultFormat;
    const endpoint = getResourceEndpoint(this.Class);
    const identifierOrIri = getResourceIdentifier(resource);
    const identifier = isIri(identifierOrIri) ? getIdentifierFromIri(identifierOrIri as string) : identifierOrIri;

    return format.serializeItem<TResource>(this.Class, resource)
      .pipe(
        map((body: object) => {
          return format.configureRequest(
            new HttpRequest<object>(
              identifier ? 'PUT' : 'POST',
              `${ this.config.apiBaseUrl }/${ endpoint }${ identifier ? `/${ identifier }` : '' }`,
              body,
              {
                headers: new HttpHeaders(options.headers),
                params: new HttpParams({fromObject: options.params}),
              },
            ),
          );
        }),
        switchMap((request: HttpRequest<TResource>) => this.httpClient.request<object>(request)),
        filter((event: HttpEvent<any>) => event.type === HttpEventType.Response),
        switchMap((response: HttpResponse<object>) => {
          if (!format.supportsResponse(response)) {
            return throwError('The Response is not supported by the format.');
          }

          return of(response.body);
        }),
        switchMap((body: object) => format.deserializeItem<TResource>(this.Class, body)),
      )
      ;
  }

  delete(resource: TResource, options?: ApiServiceDeleteOptions): Observable<void> {
    options = options || {};
    options.headers = options.headers || {};
    options.params = options.params || {};

    const format = options.format ? this.injector.get<Format>(options.format) : this.defaultFormat;
    const endpoint = getResourceEndpoint(this.Class);
    const identifierOrIri = getResourceIdentifier(resource);
    const identifier = isIri(identifierOrIri) ? getIdentifierFromIri(identifierOrIri as string) : identifierOrIri;

    if (!identifier) {
      return throwError('The resource do not have an identifier and could not be deleted.');
    }

    const request: HttpRequest<TResource> = format.configureRequest(
      new HttpRequest<TResource>(
        'DELETE',
        `${ this.config.apiBaseUrl }/${ endpoint }/${ identifier }`,
        {
          headers: new HttpHeaders(options.headers),
          params: new HttpParams({fromObject: options.params}),
        },
      ),
    );

    return this.httpClient.request<object>(request)
      .pipe(
        filter((event: HttpEvent<any>) => event.type === HttpEventType.Response),
        switchMap((response: HttpResponse<object>) => {
          if (!format.supportsResponse(response)) {
            return throwError('The Response is not supported by the format.');
          }

          return of(response.body);
        }),
        map(() => null),
      )
      ;
  }
}
