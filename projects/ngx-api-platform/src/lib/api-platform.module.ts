import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injector, ModuleWithProviders, NgModule, Provider } from '@angular/core';
import 'reflect-metadata';
import { API_PLATFORM_CONFIG, ApiPlatformConfig } from './api-platform-config';
import { ApiService, ApiServiceTokenFor } from './api-service';
import { API_PLATFORM_SERIALIZERS, DateSerializer, NativeSerializer, ResourceSerializer } from './serializer';

function getApiServiceProviders(config: ApiPlatformConfig): Array<Provider> {
  return config.resources.map((ResourceClass: Function) => (
    {
      provide: ApiServiceTokenFor(ResourceClass),
      useFactory: (
        config: ApiPlatformConfig,
        httpClient: HttpClient,
        resourceSerializer: ResourceSerializer,
        injector: Injector,
      ) => new ApiService(ResourceClass, config, httpClient, resourceSerializer, injector),
      deps: [
        API_PLATFORM_CONFIG,
        HttpClient,
        ResourceSerializer,
        Injector,
      ],
    }
  ));
}

@NgModule({
  declarations: [],
  imports: [
    HttpClientModule,
  ],
  providers: [
    {
      provide: ResourceSerializer,
    },
    {
      provide: API_PLATFORM_SERIALIZERS,
      multi: true,
      useClass: DateSerializer,
    },
    {
      provide: API_PLATFORM_SERIALIZERS,
      multi: true,
      useClass: NativeSerializer,
    },
    {
      provide: ResourceSerializer,
    },
  ],
  exports: [],
})
export class ApiPlatformModule {
  static forRoot(config: ApiPlatformConfig): ModuleWithProviders<ApiPlatformModule> {
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
