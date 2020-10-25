import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ApiPlatformConfig } from './api-platform-config';
import { ResourceMetadata } from './metadata';
import { ApiServiceCollectionOptions, ApiServiceItemOptions } from './options';
import { getResourceMetadata } from './utils';

export function ApiServiceTokenFor(Class: Function): string {
  const resourceMetadata: ResourceMetadata = getResourceMetadata(Class);

  return `API_PLATFORM_API_SERVICE_${ resourceMetadata.Class.name }_${ resourceMetadata.options.endpoint }`;
}

export class ApiService<TResource extends object> {
  constructor(
    private Class: Function,
    private config: ApiPlatformConfig,
    private httpClient: HttpClient,
  ) {
  }

  getItem(identifier: string | number, options?: ApiServiceItemOptions): Observable<TResource> {
    return of({identifier, options} as TResource);
  }

  getCollection(options?: ApiServiceCollectionOptions): Observable<Array<TResource>> {
    return of([options as TResource]);
  }
}
