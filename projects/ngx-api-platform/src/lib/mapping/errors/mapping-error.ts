import { ApiPlatformError } from '../../errors/api-platform-error';

export class MappingError extends ApiPlatformError {
  constructor(message?: string) {
    super(`[Mapping] ${ message }`);
  }
}
