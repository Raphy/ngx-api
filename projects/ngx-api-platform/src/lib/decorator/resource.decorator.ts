import { ResourceMetadata } from '../metadata';
import { ResourceOptions } from '../options';
import { addResourceMetadata } from '../utils';

/**
 * Defines a resource.
 *
 * @Annotation
 * @publicApi
 */
export function Resource(endpoint: string): ClassDecorator;

/**
 * Defines a resource.
 *
 * @Annotation
 * @publicApi
 */
export function Resource(options: ResourceOptions): ClassDecorator;

/**
 * Defines a resource.
 *
 * @Annotation
 * @publicApi
 */
export function Resource(endpoint: string, options: Pick<ResourceOptions, Exclude<keyof ResourceOptions, 'endpoint'>>): ClassDecorator;

/**
 * Defines a resource.
 *
 * @Annotation
 * @publicApi
 */
export function Resource(endpointOrOptions: string | ResourceOptions, maybeOptions?: ResourceOptions): ClassDecorator {
  return (Class: Function): void => {
    const options: ResourceOptions = Object.assign(
      typeof endpointOrOptions === 'string' ? {endpoint: endpointOrOptions} : endpointOrOptions,
      maybeOptions || {},
    );
    options.identifierPropertyName = options.identifierPropertyName || 'id';

    const metadata: ResourceMetadata = {
      Class,
      options,
    };

    addResourceMetadata(Class, metadata);
  };
}
