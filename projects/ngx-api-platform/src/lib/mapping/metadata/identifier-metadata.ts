import { Type } from '@angular/core';
import { IdentifierOptions } from '../options';

export interface IdentifierMetadata {
  target: Type<any>;

  propertyName: string;

  options: IdentifierOptions;
}
