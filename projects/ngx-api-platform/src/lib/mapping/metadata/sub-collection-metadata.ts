import { Type } from '@angular/core';
import { SubCollectionOptions } from '../options/sub-collection-options';

export interface SubCollectionMetadata {
  target: Type<any>;

  propertyName: string;

  options: SubCollectionOptions;
}
