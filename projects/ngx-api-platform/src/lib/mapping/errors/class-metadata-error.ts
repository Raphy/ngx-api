import { Type } from '@angular/core';
import { MappingError } from './mapping-error';

export class ClassMetadataError extends MappingError {
  constructor(type: Type<any>, message?: string) {
    super(`The class "${ type.name }" is invalid${ message ? `: ${ message }` : '' }`);
  }
}
