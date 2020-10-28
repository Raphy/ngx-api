import { HttpClientModule } from '@angular/common/http';
import { Injector, ModuleWithProviders, NgModule, Provider, Type } from '@angular/core';
import 'reflect-metadata';
import { API_PLATFORM_CONFIG, ApiPlatformConfig } from './api-platform-config';
import { resourceServiceFactory, ResourceServiceTokenFor } from './resource-service';

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
