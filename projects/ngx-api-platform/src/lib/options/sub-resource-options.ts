import { ApiServiceItemOptions } from '../options';
import { Resource, ResourceClass } from '../types';

export interface SubResourceOptions {
  /**
   * Defines the mapped resource class that represents the sub resource.
   */
  SubResourceClass: () => ResourceClass;

  /**
   * Defines the options to pass to the ApiService when requesting the item.
   *
   * The options can be dynamically defined when passing an anonymous function that takes the current resource instance as argument.
   */
  apiServiceItemOptions?: ApiServiceItemOptions | ((resource: Resource) => ApiServiceItemOptions);
}
