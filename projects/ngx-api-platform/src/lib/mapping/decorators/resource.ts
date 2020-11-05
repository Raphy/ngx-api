import { ResourceMetadata } from '../metadata';
import { ResourceOptions } from '../options';
import { addResourceMetadata } from '../utilities';

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
 */
export function Resource(endpointOrOptions: string | ResourceOptions, maybeOptions?: ResourceOptions): ClassDecorator {
  return (target: Function): void => {
    const options: ResourceOptions = {
      endpoint: (typeof endpointOrOptions === 'string' ? endpointOrOptions : endpointOrOptions.endpoint),
    };

    const metadata: ResourceMetadata = {
      target,
      options,
    };

    addResourceMetadata(metadata);
  };
}
