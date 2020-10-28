import { ApiPlatformError } from '../../errors/api-platform-error';

export class SerializerError extends ApiPlatformError {
  constructor(message?: string) {
    super(`[Serializer] ${ message }`);
  }
}
