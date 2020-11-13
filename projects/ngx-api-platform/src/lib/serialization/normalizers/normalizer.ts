import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export const API_PLATFORM_NORMALIZERS = new InjectionToken<Array<Normalizer>>('API_PLATFORM_NORMALIZERS');

export interface Normalizer {
  /**
   * Normalize the given value into a serializable value
   */
  normalize(value: any, context?: object): Observable<any>;

  /**
   * Checks if this normalizer supports normalizing the given value
   */
  supportsNormalization(value: any): Observable<boolean>;

  /**
   * Gets the normalization order.
   */
  getNormalizationOrder(): number;
}
