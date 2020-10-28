import { Type } from '@angular/core';
import { OutputMetadata } from '../metadata';
import { OutputOptions } from '../options';
import { addOutputMetadata, getPropertyMetadata } from '../utilities';
import { Property } from './property';

/**
 * Defines a resource output property. The value will be received from the API.
 *
 * @Annotation
 * @publicApi
 */
export function Output(): PropertyDecorator;

/**
 * Defines a resource output property. The value will be received from the API.
 *
 * @Annotation
 * @publicApi
 */
export function Output(options: OutputOptions): PropertyDecorator;

/**
 * Defines a resource output property. The value will be received from the API.
 */
export function Output(options?: OutputOptions): PropertyDecorator {
  return (target: Object, propertyName: string): void => {
    options = options || {};

    const metadata: OutputMetadata = {
      target: target.constructor as Type<any>,
      propertyName,
      options,
    };

    addOutputMetadata(metadata);

    if (!getPropertyMetadata(metadata.target, metadata.propertyName)) {
      Property()(target, propertyName);
    }
  };
}
