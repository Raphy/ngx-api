import { SubResourceOptions } from '../options';

export interface SubResourceMetadata
{
  Class: Function;

  propertyName: string;

  options: SubResourceOptions;
}
