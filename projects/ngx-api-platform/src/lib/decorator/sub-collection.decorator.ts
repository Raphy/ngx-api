import { SubCollectionMetadata } from '../metadata';
import { SubCollectionOptions } from '../options';
import { Resource, ResourceClass } from '../types';
import { addSubCollectionMetadata } from '../utils';

/**
 * Defines a resource sub collection.
 *
 * @Annotation
 * @publicApi
 */
export function SubCollection(options: SubCollectionOptions): PropertyDecorator;

/**
 * Defines a resource sub collection.
 *
 * @Annotation
 * @publicApi
 */
export function SubCollection(SubResourceClass: () => ResourceClass): PropertyDecorator;

/**
 * Defines a resource sub collection.
 *
 * @Annotation
 * @publicApi
 */
export function SubCollection(
  SubResourceClass: () => ResourceClass,
  options: Pick<SubCollectionOptions, Exclude<keyof SubCollectionOptions, 'SubResourceClass'>>,
): PropertyDecorator;

/**
 * Defines a resource sub collection.
 *
 * @Annotation
 * @publicApi
 */
export function SubCollection(
  SubResourceClassOrOptions: (() => ResourceClass) | SubCollectionOptions,
  maybeOptions ?: SubCollectionOptions,
): PropertyDecorator {
  return (object: Resource, propertyName: string): void => {
    const options: SubCollectionOptions = SubResourceClassOrOptions instanceof Function
      ? Object.assign(maybeOptions, {SubResourceClass: SubResourceClassOrOptions as ResourceClass})
      : SubResourceClassOrOptions as SubCollectionOptions;
    options.subEndpoint = options.subEndpoint || propertyName as string;

    const metadata: SubCollectionMetadata = {
      Class: object.constructor,
      propertyName: propertyName as string,
      options,
    };

    addSubCollectionMetadata(object.constructor, metadata);
  };
}

