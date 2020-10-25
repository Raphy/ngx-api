import { PropertyOptions } from '../options';

export interface PropertyMetadata
{
  Class: Function;

  propertyName: string;

  options: PropertyOptions;
}
