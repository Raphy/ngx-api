import { PropertyOptions } from '../options';

export interface PropertyMetadata {
  target: Function;

  propertyName: string;

  options: PropertyOptions;
}
