import { ApiServiceItemOptions } from '../options';

export interface SubResourceOptions {
  SubResourceClass?: () => Function;

  apiServiceItemOptions?: ApiServiceItemOptions | ((resource: Object) => ApiServiceItemOptions);
}
