import { Type } from '@angular/core';
import { SubCollectionOptions } from '../options';

export interface SubCollectionMetadata
{
  Class: Function;

  propertyName: string;

  options: SubCollectionOptions;
}
