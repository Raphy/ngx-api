import { HttpClientModule } from '@angular/common/http';
import { Injector, ModuleWithProviders, NgModule, Provider } from '@angular/core';
import 'reflect-metadata';
import { API_PLATFORM_CONFIG, ApiPlatformConfig } from './api-platform-config';
import { ApiService, ApiServiceTokenFor } from './api-service';
import { API_PLATFORM_DEFAULT_FORMAT, JsonFormat } from './content-negotiation';
import {
  API_PLATFORM_DATE_NORMALIZER_FORMAT,
  API_PLATFORM_DEFAULT_DATE_FORMAT, API_PLATFORM_DENORMALIZERS,
  API_PLATFORM_NORMALIZERS,
  DateNormalizer,
} from './normalizer';

function getApiServiceProvider(Class: Function): Provider {
  return {
    provide: ApiServiceTokenFor(Class),
    useFactory: (injector: Injector) => new ApiService(Class, injector),
    deps: [Injector],
  };
}

function getApiServiceProviders(config: ApiPlatformConfig): Array<Provider> {
  return config.resources.map((Class: Function) => getApiServiceProvider(Class));
}

const normalizersProviders: Array<Provider> = [
  {
    provide: API_PLATFORM_NORMALIZERS,
    multi: true,
    useClass: DateNormalizer,
  },
];

const denormalizersProviders: Array<Provider> = [
  {
    provide: API_PLATFORM_DATE_NORMALIZER_FORMAT,
    useValue: API_PLATFORM_DEFAULT_DATE_FORMAT,
  },
  {
    provide: API_PLATFORM_DENORMALIZERS,
    multi: true,
    useClass: DateNormalizer,
  },
];

// @dynamic
@NgModule({
  declarations: [],
  imports: [
    HttpClientModule,
  ],
  providers: [
    ...denormalizersProviders,
    ...normalizersProviders,
  ],
  exports: [],
})
export class ApiPlatformModule {
  static forRoot(
    config: ApiPlatformConfig,
  ): ModuleWithProviders<ApiPlatformModule> {
    config.defaultFormat = config.defaultFormat || JsonFormat;

    return {
      ngModule: ApiPlatformModule,
      providers: [
        {
          provide: API_PLATFORM_CONFIG,
          useValue: config,
        },
        {
          provide: API_PLATFORM_DEFAULT_FORMAT,
          useClass: config.defaultFormat,
        },
        ...getApiServiceProviders(config),
      ],
    };
  }
}
