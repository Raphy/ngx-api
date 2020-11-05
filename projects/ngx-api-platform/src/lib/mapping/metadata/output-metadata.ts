import { OutputOptions } from '../options';

export interface OutputMetadata {
  target: Function;

  propertyName: string;

  options: OutputOptions;
}
