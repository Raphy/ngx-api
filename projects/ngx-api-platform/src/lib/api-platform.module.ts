import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import 'reflect-metadata';
import { API_PLATFORM_CONFIG, ApiPlatformConfig } from './api-platform-config';
import { ApiService, ApiServiceTokenFor } from './api-service';
import { ResourceClass } from './types';

export function getApiServiceProvider(
  Class: ResourceClass,
): Provider {
  return {
    provide: ApiServiceTokenFor(Class),
    useFactory: (config: ApiPlatformConfig, httpClient: HttpClient) => new ApiService(Class, config, httpClient),
    deps: [
      API_PLATFORM_CONFIG,
      HttpClient,
    ],
  };
}

export function getApiServiceProviders(
  config: ApiPlatformConfig,
): Array<Provider> {
  return config.resources.map((Class: ResourceClass) => getApiServiceProvider(Class));
}

// @dynamic
@NgModule({
  declarations: [],
  imports: [
    HttpClientModule,
  ],
  providers: [],
  exports: [],
})
export class ApiPlatformModule {
  static forRoot(
    config: ApiPlatformConfig,
  ): ModuleWithProviders<ApiPlatformModule> {
    return {
      ngModule: ApiPlatformModule,
      providers: [
        {
          provide: API_PLATFORM_CONFIG,
          useValue: config,
        },
        ...getApiServiceProviders(config),
      ],
    };
  }
}
