import { SubResourceMetadata } from '../metadata';
import { SubResourceOptions } from '../options';
import { addSubResourceMetadata, getPropertyMetadata } from '../utilities';
import { Property } from './property';

/**
 * Defines a resource sub resource.
 *
 * @Annotation
 * @publicApi
 */
export function SubResource(type: () => Function): PropertyDecorator;

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
  type: () => Function,
  options: Pick<SubResourceOptions, Exclude<keyof SubResourceOptions, 'type'>>,
): PropertyDecorator;

/**
 * Defines a resource sub resource.
 */
export function SubResource(typeOrOptions: (() => Function) | SubResourceOptions, maybeOptions ?: SubResourceOptions): PropertyDecorator {
  return (target: Object, propertyName: string): void => {
    const options: SubResourceOptions = {
      type: (typeof typeOrOptions === 'function' ? typeOrOptions : typeOrOptions.type),
    };
    Object.assign(options, maybeOptions || {});
    options.resourceServiceOptions = options.resourceServiceOptions || {};

    const metadata: SubResourceMetadata = {
      target: target.constructor,
      propertyName,
      options,
    };

    addSubResourceMetadata(metadata);

    if (!getPropertyMetadata(metadata.target, metadata.propertyName)) {
      Property()(target, propertyName);
    }
  };
}
