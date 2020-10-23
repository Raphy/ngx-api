export interface PropertyOptions {
  name?: string;

  type?: (() => Function);

  input?: boolean;

  output?: boolean;
}
