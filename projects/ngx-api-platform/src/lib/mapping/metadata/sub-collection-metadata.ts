import { SubCollectionOptions } from '../options';

export interface SubCollectionMetadata {
  target: Function;

  propertyName: string;

  options: SubCollectionOptions;
}
