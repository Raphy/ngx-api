import { MetadataKey, ResourceMetadata } from '../metadata';
import { ResourceOptions } from '../options';

/**
 * @Annotation
 * @publicApi
 */
export function Resource(endpoint: string): ClassDecorator;

/**
 * @Annotation
 * @publicApi
 */
export function Resource(options: ResourceOptions): ClassDecorator;

/**
 * @Annotation
 * @publicApi
 */
export function Resource(endpoint: string, options: Pick<ResourceOptions, Exclude<keyof ResourceOptions, 'endpoint'>>): ClassDecorator;

/**
 * @Annotation
 * @publicApi
 */
export function Resource(endpointOrOptions: string | ResourceOptions, maybeOptions?: ResourceOptions): ClassDecorator {
  return (ResourceClass: Function): void => {
    const options: ResourceOptions = Object.assign(typeof endpointOrOptions === 'string' ? {endpoint: endpointOrOptions} : endpointOrOptions, maybeOptions || {});
    options.identifierPropertyName = options.identifierPropertyName || 'id';

    const metadata: ResourceMetadata = {
      class: ResourceClass,
      options: options,
    };

    Reflect.defineMetadata(MetadataKey.Resource, metadata, ResourceClass);
  };
}
