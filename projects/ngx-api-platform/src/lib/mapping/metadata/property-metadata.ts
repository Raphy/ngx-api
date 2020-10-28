import { Type } from '@angular/core';
import { PropertyOptions } from '../options/property-options';

export interface PropertyMetadata {
  target: Type<any>;

  propertyName: string;

  options: PropertyOptions;
}
