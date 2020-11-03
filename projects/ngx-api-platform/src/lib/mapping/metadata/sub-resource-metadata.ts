import { SubResourceOptions } from '../options';

export interface SubResourceMetadata {
  target: Function;

  propertyName: string;

  options: SubResourceOptions;
}
