import { Type } from '@angular/core';
import { PropertyMetadata } from '../metadata';
import { PropertyOptions } from '../options';
import { addPropertyMetadata } from '../utilities';

/**
 * Defines a resource property.
 *
 * @Annotation
 * @publicApi
 */
export function Property(): PropertyDecorator;

/**
 * Defines a resource property.
 *
 * @Annotation
 * @publicApi
 */
export function Property(options: PropertyOptions): PropertyDecorator;

/**
 * Defines a resource property.
 *
 * @Annotation
 * @publicApi
 */
export function Property(name: string): PropertyDecorator;

/**
 * Defines a resource property.
 *
 * @Annotation
 * @publicApi
 */
export function Property(name: string, options: Pick<PropertyOptions, Exclude<keyof PropertyOptions, 'name'>>): PropertyDecorator;

/**
 * Defines a resource property.
 */
export function Property(nameOrOptions?: string | PropertyOptions, maybeOptions ?: PropertyOptions): PropertyDecorator {
  return (target: Object, propertyName: string): void => {
    const options: PropertyOptions = Object.assign(
      typeof nameOrOptions === 'string' ? {name: nameOrOptions} : nameOrOptions || {},
      maybeOptions || {},
    );
    options.name = options.name || propertyName;

    options.type = options.type || Reflect.getMetadata('design:type', target, propertyName);
    if (!options.type) {
      throw new Error(`Could not determinate the type of the property "${ propertyName }".`);
    }

    const metadata: PropertyMetadata = {
      target: target.constructor as Type<any>,
      propertyName,
      options,
    };

    addPropertyMetadata(metadata);
  };
}
