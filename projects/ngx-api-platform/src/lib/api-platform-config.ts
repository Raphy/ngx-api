import { InjectionToken, Type } from '@angular/core';
import { Format } from './content-negotiation';

export const API_PLATFORM_CONFIG: InjectionToken<ApiPlatformConfig> = new InjectionToken<ApiPlatformConfig>('API_PLATFORM_CONFIG');

export interface ApiPlatformConfig {
  apiBaseUrl: string;

  resources: Array<Function>;

  defaultFormat?: Type<Format>;
}
