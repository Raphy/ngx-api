import { ResourceOptions } from '../options';
import { ResourceClass } from '../types';

export interface ResourceMetadata {
  Class: ResourceClass;

  options: ResourceOptions;
}
