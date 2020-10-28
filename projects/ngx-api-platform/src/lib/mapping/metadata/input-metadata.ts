import { Type } from '@angular/core';
import { InputOptions } from '../options';

export interface InputMetadata {
  target: Type<any>;

  propertyName: string;

  options: InputOptions;
}
