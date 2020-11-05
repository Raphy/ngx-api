import { MappingError } from './mapping-error';

export class PropertyMetadataError extends MappingError {
  constructor(type: Function, propertyName: string, message?: string) {
    super(`The class "${ type.name }" is invalid on the property "${ propertyName }"${ message ? `: ${ message }` : '' }`);
  }
}
