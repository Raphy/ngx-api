import { Type } from '@angular/core';
import { ResourceServiceOptions } from '../../resource-service-options';

export interface SubCollectionOptions {
  /**
   * The type of the sub resource.
   */
  type: () => Type<any>;

  /**
   * The options passed to ResourceService::getCollection().
   */
  resourceServiceOptions?: ResourceServiceOptions | ((resource: Object, body: object) => ResourceServiceOptions);
}
