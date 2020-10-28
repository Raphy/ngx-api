import { Type } from '@angular/core';
import { SubCollectionMetadata } from '../metadata';
import { SubCollectionOptions } from '../options';
import { addSubCollectionMetadata } from '../utilities';

/**
 * Defines a resource sub collection.
 *
 * @Annotation
 * @publicApi
 */
export function SubCollection(type: () => Type<any>): PropertyDecorator;

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
export function SubCollection(
  type: () => Type<any>,
  options: Pick<SubCollectionOptions, Exclude<keyof SubCollectionOptions, 'type'>>,
): PropertyDecorator;

/**
 * Defines a resource sub collection.
 */
export function SubCollection(
  typeOrOptions: (() => Type<any>) | SubCollectionOptions,
  maybeOptions ?: SubCollectionOptions,
): PropertyDecorator {
  return (target: Object, propertyName: string): void => {
    const options: SubCollectionOptions = {
      type: (typeof typeOrOptions === 'function' ? typeOrOptions : typeOrOptions.type),
    };
    Object.assign(options, maybeOptions || {});

    const metadata: SubCollectionMetadata = {
      target: target.constructor as Type<any>,
      propertyName,
      options,
    };

    addSubCollectionMetadata(metadata);
  };
}
