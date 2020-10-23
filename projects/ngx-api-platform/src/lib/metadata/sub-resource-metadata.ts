import { SubResourceOptions } from '../options';

export interface SubResourceMetadata
{
  class: Function;

  propertyName: string;

  options: SubResourceOptions;
}
