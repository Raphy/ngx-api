import { Type } from '@angular/core';
import { SubResourceMetadata } from '../metadata/sub-resource-metadata';
import { SubResourceOptions } from '../options/sub-resource-options';
import { addSubResourceMetadata, getPropertyMetadata } from '../../utilities/metadata';
import { Property } from './property';

/**
 * Defines a resource sub resource.
 *
 * @Annotation
 * @publicApi
 */
export function SubResource(type: () => Type<any>): PropertyDecorator;

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
export function SubResource(
  type: () => Type<any>,
  options: Pick<SubResourceOptions, Exclude<keyof SubResourceOptions, 'type'>>,
): PropertyDecorator;

/**
 * Defines a resource sub resource.
 */
export function SubResource(typeOrOptions: (() => Type<any>) | SubResourceOptions, maybeOptions ?: SubResourceOptions): PropertyDecorator {
  return (target: Object, propertyName: string): void => {
    const options: SubResourceOptions = {
      type: (typeof typeOrOptions === 'function' ? typeOrOptions : typeOrOptions.type),
    };
    Object.assign(options, maybeOptions || {});
    options.resourceServiceOptions = options.resourceServiceOptions || {};

    const metadata: SubResourceMetadata = {
      target: target.constructor as Type<any>,
      propertyName,
      options,
    };

    addSubResourceMetadata(metadata);

    if (!getPropertyMetadata(metadata.target, metadata.propertyName)) {
      Property()(target, propertyName);
    }
  };
}
