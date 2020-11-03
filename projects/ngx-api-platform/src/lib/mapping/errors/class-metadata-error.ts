import { MappingError } from './mapping-error';

export class ClassMetadataError extends MappingError {
  constructor(type: Function, message?: string) {
    super(`The class "${ type.name }" is invalid${ message ? `: ${ message }` : '' }`);
  }
}
