export interface ResourceOptions {
  /**
   * Defines the resource endpoint.
   */
  endpoint: string;

  /**
   * Defines the property of the resource used as identifier. By default it's `id`.
   */
  identifierPropertyName?: string;
}
