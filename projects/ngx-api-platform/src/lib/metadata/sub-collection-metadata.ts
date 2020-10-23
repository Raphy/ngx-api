import { SubCollectionOptions } from '../options';

export interface SubCollectionMetadata
{
  class: Function;

  propertyName: string;

  options: SubCollectionOptions;
}
