import { MetadataKey, SubResourceMetadata } from '../metadata';
import { SubResourceOptions } from '../options';

/**
 * @Annotation
 * @publicApi
 */
export function SubResource(): PropertyDecorator;

/**
 * @Annotation
 * @publicApi
 */
export function SubResource(options: SubResourceOptions): PropertyDecorator;

/**
 * @Annotation
 * @publicApi
 */
export function SubResource(SubResourceClass: () => Function): PropertyDecorator;

/**
 * @Annotation
 * @publicApi
 */
export function SubResource(SubResourceClass: () => Function, options: Pick<SubResourceOptions, Exclude<keyof SubResourceOptions, 'SubResourceClass'>>): PropertyDecorator;

/**
 * @Annotation
 * @publicApi
 */
export function SubResource(SubResourceClassOrOptions?: (() => Function) | SubResourceOptions, maybeOptions ?: SubResourceOptions): PropertyDecorator {
  return (object: Object, propertyName: string): void => {
    const options: SubResourceOptions = Object.assign(SubResourceClassOrOptions instanceof Function ? {SubResourceClass: SubResourceClassOrOptions} : SubResourceClassOrOptions || {}, maybeOptions || {});

    const metadata: SubResourceMetadata = {
      class: object.constructor,
      propertyName: propertyName,
      options: options || {},
    };

    if (false === Reflect.hasMetadata(MetadataKey.SubResources, object.constructor)) {
      Reflect.defineMetadata(MetadataKey.SubResources, {}, object.constructor);
    }

    const definedMetadata: { [propertyName: string]: SubResourceMetadata } = Reflect.getMetadata(MetadataKey.SubResources, object.constructor);
    definedMetadata[propertyName] = metadata;
    Reflect.defineMetadata(MetadataKey.SubResources, definedMetadata, object.constructor);
  };
}

