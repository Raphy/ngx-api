import { Injectable } from '@angular/core';
import { Serializer } from './serializer';

@Injectable()
export class NativeSerializer implements Serializer
{
  deserialize(value: number | string | boolean, type: any): number | string | boolean {
    return value;
  }

  serialize(value: number | string | boolean, type: any): number | string | boolean {
    return value;
  }

  supports(type: any): boolean {
    return type === Number || type === String || type === Boolean;
  }
}
