export class ApiPlatformError extends Error {
  constructor(message?: string) {
    super(`[ApiPlatform] ${ message }`);
  }
}
