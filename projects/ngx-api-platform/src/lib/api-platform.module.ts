import { HttpClientModule } from '@angular/common/http';
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

// @dynamic
@NgModule({
  declarations: [],
  imports: [
    HttpClientModule,
  ],
  providers: [
    {
      provide: Serializer,
    },
    ...SerializationDenormalizerProviders,
    ...SerializationNormalizerProviders,
  ],
  exports: [],
})
export class ApiPlatformModule {
  static forRoot(
    config: ApiPlatformConfig,
  ): ModuleWithProviders<ApiPlatformModule> {
    config.resourceMappingValidation = config.resourceMappingValidation === undefined ? 'enabled' : 'disabled';

    return {
      ngModule: ApiPlatformModule,
      providers: [
        {
          provide: API_PLATFORM_CONFIG,
          useValue: config,
        },
        config.resources.map(<TResource>(type: Function): Provider => ({
          provide: ResourceServiceTokenFor<TResource>(type),
          useFactory: resourceServiceFactory<TResource>(type),
          deps: [Injector],
        })),
      ],
    };
  }
}
