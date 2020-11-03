import { Type } from '@angular/core';
import { InputMetadata } from '../metadata';
import { InputOptions } from '../options';
import { addInputMetadata, getPropertyMetadata } from '../utilities';
import { Property } from './property';

/**
 * Defines a resource input property. The value of the field will be sent to the API.
 *
 * @Annotation
 * @publicApi
 */
export function Input(): PropertyDecorator;

/**
 * Defines a resource input property. The value of the field will be sent to the API.
 *
 * @Annotation
 * @publicApi
 */
export function Input(options: InputOptions): PropertyDecorator;

/**
 * Defines a resource input property. The value of the field will be sent to the API.
 */
export function Input(options?: InputOptions): PropertyDecorator {
  return (target: Object, propertyName: string): void => {
    options = options || {};

    const metadata: InputMetadata = {
      target: target.constructor as Type<any>,
      propertyName,
      options,
    };

    addInputMetadata(metadata);

    if (!getPropertyMetadata(metadata.target, metadata.propertyName)) {
      Property()(target, propertyName);
    }
  };
}
