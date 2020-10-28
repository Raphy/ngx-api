import { Type } from '@angular/core';
import { InputOptions } from '../options/input-options';

export interface InputMetadata {
  target: Type<any>;

  propertyName: string;

  options: InputOptions;
}
