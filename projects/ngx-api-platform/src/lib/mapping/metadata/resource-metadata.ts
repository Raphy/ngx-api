import { Type } from '@angular/core';
import { ResourceOptions } from '../options/resource-options';

export interface ResourceMetadata {
  target: Type<any>;

  options: ResourceOptions;
}
