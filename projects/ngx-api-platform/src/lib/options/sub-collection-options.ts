import { ApiServiceCollectionOptions } from '../options';
import { Resource, ResourceClass } from '../types';

export interface SubCollectionOptions {
  /**
   * Defines the mapped resource class that represents the sub collection.
   */
  SubResourceClass: () => ResourceClass;

  /**
   * Defines the sub resource endpoint. By default it will suffix the property name to the current resource IRI.
   *
   * The sub endpoint can be dynamically defined when passing an anonymous function that takes the current resource instance as argument.
   *
   * Example:
   *  - The current IRI is `/users/42`
   *  - The property name containing the sub collection is `comments`
   * The default sub endpoint will be `comments` and the HttpRequest URL will be `/users/42/comments`.
   */
  subEndpoint?: string | ((resource: Resource) => string);

  /**
   * Defines the options to pass to the ApiService when requesting the collection.
   *
   * The options can be dynamically defined when passing an anonymous function that takes the current resource instance as argument.
   */
  apiServiceCollectionOptions?: ApiServiceCollectionOptions | ((resource: Resource) => ApiServiceCollectionOptions);
}
