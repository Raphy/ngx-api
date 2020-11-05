import { ApiPlatformError } from '../../errors';

export class SerializerError extends ApiPlatformError {
  constructor(message?: string) {
    super(`[Serializer] ${ message }`);
  }
}
