import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export const API_PLATFORM_DENORMALIZERS = new InjectionToken<Array<Denormalizer>>('API_PLATFORM_DENORMALIZERS');

export interface DenormalizerContext {
  parentContext?: DenormalizerContext;

  value?: any;

  type?: Function;

  propertyName?: string;
}

export interface Denormalizer {
  supportsDenormalization(value: any, type: Function, context?: DenormalizerContext): boolean;

  denormalize(value: any, type: Function, context?: DenormalizerContext): Observable<any>;
}
