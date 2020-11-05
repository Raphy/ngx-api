import { ResourceServiceOptions } from '../../resource-service-options';

export interface SubResourceOptions {
  /**
   * The type of the sub resource.
   */
  type: () => Function;

  /**
   * The options passed to ResourceService::getResource().
   */
  resourceServiceOptions?: ResourceServiceOptions | ((resource?: Object) => ResourceServiceOptions);
}
