import { ApiPlatformError } from '../../errors';

export class MappingError extends ApiPlatformError {
  constructor(message?: string) {
    super(`[Mapping] ${ message }`);
  }
}
