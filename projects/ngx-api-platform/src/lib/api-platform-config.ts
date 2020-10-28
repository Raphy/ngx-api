import { InjectionToken, Type } from '@angular/core';

export const API_PLATFORM_CONFIG: InjectionToken<ApiPlatformConfig> = new InjectionToken<ApiPlatformConfig>('API_PLATFORM_CONFIG');

export interface ApiPlatformConfig {
  /**
   * The base URL of the API.
   */
  apiBaseUrl: string;

  /**
   * The list of resources class to use.
   */
  resources: Array<Type<any>>;

  /**
   * The resource mapping validation is used for development purposes only.
   * It will help you to check if the resources are correctly mapped.
   * Disable it on production.
   */
  resourceMappingValidation?: 'enabled' | 'disabled';
}
