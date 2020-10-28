import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export const API_PLATFORM_NORMALIZERS = new InjectionToken<Array<Normalizer>>('API_PLATFORM_NORMALIZERS');

export interface Normalizer {
  supportsNormalization(value: any, type: Function): boolean;

  normalize(value: any, type: Function): Observable<any>;
}
