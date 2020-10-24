import { SubCollectionOptions } from '../options';
import { ResourceClass } from '../types';

export interface SubCollectionMetadata
{
  Class: ResourceClass;

  propertyName: string;

  options: SubCollectionOptions;
}
