import { SubResourceMetadata } from '../metadata';
import { SubResourceOptions } from '../options';
import { Resource, ResourceClass } from '../types';
import { addSubResourceMetadata } from '../utils';

/**
 * Defines a resource sub resource.
 *
 * @Annotation
 * @publicApi
 */
export function SubResource(options: SubResourceOptions): PropertyDecorator;

/**
 * Defines a resource sub resource.
 *
 * @Annotation
 * @publicApi
 */
export function SubResource(SubResourceClass: () => ResourceClass): PropertyDecorator;

/**
 * Defines a resource sub resource.
 *
 * @Annotation
 * @publicApi
 */
export function SubResource(
  SubResourceClass: () => ResourceClass,
  options: Pick<SubResourceOptions, Exclude<keyof SubResourceOptions, 'SubResourceClass'>>,
): PropertyDecorator;

/**
 * Defines a resource sub resource.
 *
 * @Annotation
 * @publicApi
 */
export function SubResource(
  SubResourceClassOrOptions: (() => ResourceClass) | SubResourceOptions,
  maybeOptions ?: SubResourceOptions,
): PropertyDecorator {
  return (object: Resource, propertyName: string): void => {
    const options = SubResourceClassOrOptions instanceof Function
      ? Object.assign(maybeOptions, {SubResourceClass: SubResourceClassOrOptions})
      : SubResourceClassOrOptions as SubResourceOptions;

    const metadata: SubResourceMetadata = {
      Class: object.constructor,
      propertyName: propertyName as string,
      options,
    };

    addSubResourceMetadata(object.constructor, metadata);
  };
}

