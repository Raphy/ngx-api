import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export const API_PLATFORM_DENORMALIZERS = new InjectionToken<Array<Denormalizer>>('API_PLATFORM_DENORMALIZERS');

export interface Denormalizer {
  supportsDenormalization(value: any, type: Function): boolean;

  denormalize(value: any, type: Function): Observable<any>;
}
