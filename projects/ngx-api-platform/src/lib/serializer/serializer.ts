import { InjectionToken } from '@angular/core';

export const API_PLATFORM_SERIALIZERS: InjectionToken<Array<Serializer>> = new InjectionToken<Array<Serializer>>('API_PLATFORM_SERIALIZERS');

export interface Serializer
{
  supports(type: any): boolean;

  serialize(value: any, type: any): any;

  deserialize(value: any, type: any): any;
}
