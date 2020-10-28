import { HttpClientModule } from '@angular/common/http';
import { Injector, ModuleWithProviders, NgModule, Provider, Type } from '@angular/core';
import 'reflect-metadata';
import { API_PLATFORM_CONFIG, ApiPlatformConfig } from './api-platform-config';
import { resourceServiceFactory, ResourceServiceTokenFor } from './resource-service';
import { DateNormalizer } from './serializer/normalization/date-normalizer';
import { API_PLATFORM_DENORMALIZERS } from './serializer/normalization/denormalizer';
import { API_PLATFORM_NORMALIZERS } from './serializer/normalization/normalizer';
import { ResourceNormalizer } from './serializer/normalization/resource-normalizer';
import { SubResourceNormalizer } from './serializer/normalization/sub-resource-normalizer';
import { Serializer } from './serializer/serializer';

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
    {
      provide: API_PLATFORM_NORMALIZERS,
      multi: true,
      useClass: SubResourceNormalizer,
    },


    {
      provide: API_PLATFORM_DENORMALIZERS,
      multi: true,
      useClass: DateNormalizer,
    },
    {
      provide: API_PLATFORM_DENORMALIZERS,
      multi: true,
      useClass: SubResourceNormalizer,
    },
    {
      provide: API_PLATFORM_DENORMALIZERS,
      multi: true,
      useClass: ResourceNormalizer,
    },
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
        config.resources.map(<TResource extends object>(type: Type<any>): Provider => ({
          provide: ResourceServiceTokenFor(type),
          useFactory: resourceServiceFactory(type),
          deps: [Injector],
        })),
      ],
    };
  }
}
