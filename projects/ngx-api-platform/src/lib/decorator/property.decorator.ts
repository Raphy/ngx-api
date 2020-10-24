import { PropertyMetadata } from '../metadata';
import { PropertyOptions } from '../options';
import { Resource } from '../types';
import { addPropertyMetadata } from '../utils';

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
 *
 * @Annotation
 * @publicApi
 */
export function Property(nameOrOptions?: string | PropertyOptions, maybeOptions ?: PropertyOptions): PropertyDecorator {
  return (object: Resource, propertyName: string): void => {
    const options: PropertyOptions = {};
    if (typeof nameOrOptions === 'string') {
      Object.assign(options, maybeOptions || {});
      options.name = nameOrOptions as string;
    }
    if (typeof nameOrOptions === 'object') {
      Object.assign(options, nameOrOptions);
    }
    options.name = options.name || propertyName as string;
    options.input = typeof options.input === 'boolean' ? options.input : true;
    options.output = typeof options.output === 'boolean' ? options.output : true;
    options.type = options.name || Reflect.getMetadata('design:type', object, propertyName);

    if (!options.type) {
      throw new Error(`[ApiPlatform] The Property() decorator could not determinate the type of the property "${ propertyName }"`);
    }

    const metadata: PropertyMetadata = {
      Class: object.constructor,
      propertyName: propertyName as string,
      options: options || {},
    };

    addPropertyMetadata(object.constructor, metadata);
  };
}

