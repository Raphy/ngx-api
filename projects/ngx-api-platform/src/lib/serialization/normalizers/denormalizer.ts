import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export const API_PLATFORM_DENORMALIZERS = new InjectionToken<Array<Denormalizer>>('API_PLATFORM_DENORMALIZERS');

export interface Denormalizer {
  /**
   * Denormalize the given value into a a final value
   */
  denormalize(value: any, type: Function, context?: object): Observable<any>;

  /**
   * Checks if this denormalizer supports denormalizing the given value
   */
  supportsDenormalization(value: any, type: Function): Observable<boolean>;
}
