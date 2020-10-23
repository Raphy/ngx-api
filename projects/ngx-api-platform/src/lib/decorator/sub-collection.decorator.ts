import { MetadataKey, SubCollectionMetadata } from '../metadata';
import { SubCollectionOptions } from '../options';

/**
 * @Annotation
 * @publicApi
 */
export function SubCollection(): PropertyDecorator;

/**
 * @Annotation
 * @publicApi
 */
export function SubCollection(options: SubCollectionOptions): PropertyDecorator;

/**
 * @Annotation
 * @publicApi
 */
export function SubCollection(SubResourceClass: () => Function): PropertyDecorator;

/**
 * @Annotation
 * @publicApi
 */
export function SubCollection(SubResourceClass: () => Function, options: Pick<SubCollectionOptions, Exclude<keyof SubCollectionOptions, 'SubResourceClass'>>): PropertyDecorator;

/**
 * @Annotation
 * @publicApi
 */
export function SubCollection(SubResourceClassOrOptions?: (() => Function) | SubCollectionOptions, maybeOptions ?: SubCollectionOptions): PropertyDecorator {
  return (object: Object, propertyName: string): void => {
    const options: SubCollectionOptions = Object.assign(SubResourceClassOrOptions instanceof Function ? {SubResourceClass: SubResourceClassOrOptions} : SubResourceClassOrOptions || {}, maybeOptions || {});
    options.subEndpoint = options.subEndpoint || propertyName;

    const metadata: SubCollectionMetadata = {
      class: object.constructor,
      propertyName,
      options: options || {},
    };

    if (false === Reflect.hasMetadata(MetadataKey.SubCollections, object.constructor)) {
      Reflect.defineMetadata(MetadataKey.SubCollections, {}, object.constructor);
    }

    const definedMetadata: { [propertyName: string]: SubCollectionMetadata } = Reflect.getMetadata(MetadataKey.SubCollections, object.constructor);
    definedMetadata[propertyName] = metadata;
    Reflect.defineMetadata(MetadataKey.SubCollections, definedMetadata, object.constructor);
  };
}

