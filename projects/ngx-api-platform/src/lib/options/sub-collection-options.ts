import { ApiServiceCollectionOptions } from '../options';

export interface SubCollectionOptions {
  SubResourceClass?: () => Function;

  subEndpoint?: string;

  apiServiceCollectionOptions?: ApiServiceCollectionOptions | ((resource: Object) => ApiServiceCollectionOptions);
}
