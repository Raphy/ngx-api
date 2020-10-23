import { MetadataKey, PropertyMetadata } from '../metadata';
import { PropertyOptions } from '../options';

/**
 * @Annotation
 * @publicApi
 */
export function Property(): PropertyDecorator;

/**
 * @Annotation
 * @publicApi
 */
export function Property(options: PropertyOptions): PropertyDecorator;

/**
 * @Annotation
 * @publicApi
 */
export function Property(name: string): PropertyDecorator;

/**
 * @Annotation
 * @publicApi
 */
export function Property(name: string, options: Pick<PropertyOptions, Exclude<keyof PropertyOptions, 'name'>>): PropertyDecorator;

/**
 * @Annotation
 * @publicApi
 */
export function Property(nameOrOptions?: string | PropertyOptions, maybeOptions ?: PropertyOptions): PropertyDecorator {
  return (object: Object, propertyName: string): void => {
    const options: PropertyOptions = Object.assign(typeof nameOrOptions === 'string' ? {name: nameOrOptions} : nameOrOptions || {}, maybeOptions || {});

    options.name = options.name || propertyName;
    options.input = typeof options.input === 'boolean' ? options.input : true;
    options.output = typeof options.output === 'boolean' ? options.output : true;

    if (!options.type) {
      options.type = Reflect.getMetadata('design:type', object, propertyName);
    }

    const metadata: PropertyMetadata = {
      class: object.constructor,
      propertyName: propertyName,
      options: options || {},
    };

    if (false === Reflect.hasMetadata(MetadataKey.Properties, object.constructor)) {
      Reflect.defineMetadata(MetadataKey.Properties, {}, object.constructor);
    }

    const definedMetadata: { [propertyName: string]: PropertyMetadata } = Reflect.getMetadata(MetadataKey.Properties, object.constructor);
    definedMetadata[propertyName] = metadata;
    Reflect.defineMetadata(MetadataKey.Properties, definedMetadata, object.constructor);
  };
}

