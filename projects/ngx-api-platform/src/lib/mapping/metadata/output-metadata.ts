import { Type } from '@angular/core';
import { OutputOptions } from '../options/output-options';

export interface OutputMetadata {
  target: Type<any>;

  propertyName: string;

  options: OutputOptions;
}
