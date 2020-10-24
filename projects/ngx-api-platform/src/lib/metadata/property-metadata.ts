import { PropertyOptions } from '../options';
import { ResourceClass } from '../types';

export interface PropertyMetadata
{
  Class: ResourceClass;

  propertyName: string;

  options: PropertyOptions;
}
