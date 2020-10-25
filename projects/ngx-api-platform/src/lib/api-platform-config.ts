import { InjectionToken } from '@angular/core';

export const API_PLATFORM_CONFIG: InjectionToken<ApiPlatformConfig> = new InjectionToken<ApiPlatformConfig>('API_PLATFORM_CONFIG');

export interface ApiPlatformConfig {
  apiBaseUrl: string;

  resources: Array<Function>;

  // defaultFormat?: Type<ResourceClass>
}
