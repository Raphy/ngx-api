import { Type } from '@angular/core';
import { PropertyOptions } from '../options';

export interface PropertyMetadata {
  target: Type<any>;

  propertyName: string;

  options: PropertyOptions;
}
