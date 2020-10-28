import { Type } from '@angular/core';
import { IdentifierOptions } from '../options/identifier-options';

export interface IdentifierMetadata {
  target: Type<any>;

  propertyName: string;

  options: IdentifierOptions;
}
