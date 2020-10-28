import { Type } from '@angular/core';
import { MappingError } from './mapping-error';

export class PropertyMetadataError extends MappingError {
  constructor(type: Type<any>, propertyName: string, message?: string) {
    super(`The class "${ type.name }" is invalid on the property "${ propertyName }"${ message ? `: ${ message }` : '' }`);
  }
}
