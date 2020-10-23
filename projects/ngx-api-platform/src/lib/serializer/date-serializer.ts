import { Injectable } from '@angular/core';
import { Serializer } from './serializer';

@Injectable()
export class DateSerializer implements Serializer
{
  deserialize(value: string): Date {
    return new Date(value);
  }

  serialize(value: Date): string {
    return value.toISOString();
  }

  supports(type: any): boolean {
    return type === Date;
  }
}
