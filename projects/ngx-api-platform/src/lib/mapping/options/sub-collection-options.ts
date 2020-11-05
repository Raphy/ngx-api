import { ResourceServiceOptions } from '../../resource-service-options';

export interface SubCollectionOptions {
  /**
   * The type of the sub resource.
   */
  type: () => Function;

  /**
   * The options passed to ResourceService::getCollection().
   */
  resourceServiceOptions?: ResourceServiceOptions | ((resource: Object) => ResourceServiceOptions);
}
