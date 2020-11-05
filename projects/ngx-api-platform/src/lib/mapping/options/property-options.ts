export interface PropertyOptions {
  /**
   * The name of the property in the JSON body sent and received by the API.
   */
  name?: string;

  /**
   * The type of the property. If not set, it will use Reflect to guess it.
   */
  type?: Function;
}
