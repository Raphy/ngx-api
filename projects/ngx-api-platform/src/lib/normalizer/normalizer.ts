import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export const API_PLATFORM_NORMALIZERS = new InjectionToken<Array<Normalizer>>('API_PLATFORM_NORMALIZERS');

export interface Normalizer {
  /**
   * Normalizes the given resource value into another value to send it to the API.
   */
  normalize(value: any): Observable<any>;

  /**
   * Checks whether this normalizer supports the given type.
   */
  supports(type: () => Function): boolean;
}
