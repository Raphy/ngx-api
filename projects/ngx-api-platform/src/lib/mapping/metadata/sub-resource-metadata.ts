import { Type } from '@angular/core';
import { SubResourceOptions } from '../options';

export interface SubResourceMetadata {
  target: Type<any>;

  propertyName: string;

  options: SubResourceOptions;
}
