import { PropertyOptions } from '../options';

export interface PropertyMetadata
{
  class: Function;

  propertyName: string;

  options: PropertyOptions;
}
