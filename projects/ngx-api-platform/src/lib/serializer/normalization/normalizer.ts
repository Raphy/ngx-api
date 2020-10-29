import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export const API_PLATFORM_NORMALIZERS = new InjectionToken<Array<Normalizer>>('API_PLATFORM_NORMALIZERS');

export interface NormalizerContext {
  parentContext?: NormalizerContext;

  value?: any;

  type?: Function;

  propertyName?: string;
}

export interface Normalizer {
  supportsNormalization(value: any, type: Function, context?: NormalizerContext): boolean;

  normalize(value: any, type: Function, context?: NormalizerContext): Observable<any>;
}
