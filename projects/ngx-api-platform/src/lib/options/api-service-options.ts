export interface ApiServiceOptions
{
  headers?: {[name: string]: string};

  params?: {[name: string]: string};
}

export interface ApiServiceItemOptions extends ApiServiceOptions
{
  mercure?: boolean;
}

export interface ApiServiceCollectionOptions extends ApiServiceOptions
{
  endpoint?: string;

  mercure?: boolean;
}

export interface ApiServicePersistOptions extends ApiServiceItemOptions
{
}

export interface ApiServiceDeleteOptions extends ApiServiceOptions
{
}
