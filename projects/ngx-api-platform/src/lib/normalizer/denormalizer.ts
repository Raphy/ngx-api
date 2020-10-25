import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export const API_PLATFORM_DENORMALIZERS = new InjectionToken<Array<Denormalizer>>('API_PLATFORM_DENORMALIZERS');

export interface Denormalizer {
  /**
   * Denormalizes the given value received from the API into another value to set in the resource.
   */
  denormalize(value: any): Observable<any>;

  /**
   * Checks whether this denormalizer supports the given type.
   */
  supports(type: () => Function): boolean;
}
