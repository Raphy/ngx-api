import { SubResourceOptions } from '../options';
import { ResourceClass } from '../types';

export interface SubResourceMetadata
{
  Class: ResourceClass;

  propertyName: string;

  options: SubResourceOptions;
}
