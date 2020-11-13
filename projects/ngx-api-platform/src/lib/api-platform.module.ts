import { Injector, ModuleWithProviders, NgModule, Provider } from '@angular/core';
import 'reflect-metadata';
import { API_PLATFORM_CONFIG, ApiPlatformConfig } from './api-platform-config';
import { resourceServiceFactory, ResourceServiceTokenFor } from './resource-service';
import { API_PLATFORM_DENORMALIZERS, API_PLATFORM_NORMALIZERS, DateNormalizer, ResourceNormalizer, Serializer } from './serialization';

const SerializationNormalizerProviders = [
  {
    provide: API_PLATFORM_NORMALIZERS,
    multi: true,
    useClass: DateNormalizer,
  },
  {
    provide: API_PLATFORM_NORMALIZERS,
    multi: true,
    useClass: ResourceNormalizer,
  },
];

const SerializationDenormalizerProviders = [
  {
    provide: API_PLATFORM_DENORMALIZERS,
    multi: true,
    useClass: DateNormalizer,
  },
  {
    provide: API_PLATFORM_DENORMALIZERS,
    multi: true,
    useClass: ResourceNormalizer,
  },
];

function createResourceServiceProviders(resources: Array<Function>): Array<Provider> {
  return (resources || []).map((type: Function): Provider => ({
    provide: ResourceServiceTokenFor(type),
    useFactory: resourceServiceFactory(type),
    deps: [Injector],
  }));
}

// @dynamic
@NgModule({
  declarations: [],
  imports: [],
  exports: [],
})
export class ApiPlatformModule {
  static forRoot(config: ApiPlatformConfig): ModuleWithProviders<ApiPlatformModule> {
    config.resourceMappingValidation = config.resourceMappingValidation === undefined ? 'enabled' : 'disabled';

    return {
      ngModule: ApiPlatformModule,
      providers: [
        {
          provide: API_PLATFORM_CONFIG,
          useValue: config,
        },
        {
          provide: Serializer,
        },
        ...SerializationDenormalizerProviders,
        ...SerializationNormalizerProviders,
        ...createResourceServiceProviders(config.resources),
      ],
    };
  }

  static forChild(resources: Array<Function>): ModuleWithProviders<ApiPlatformModule> {
    return {
      ngModule: ApiPlatformModule,
      providers: [
        ...createResourceServiceProviders(resources),
      ],
    };
  }
}
