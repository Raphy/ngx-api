import { Type } from '@angular/core';
import { Format } from '../content-negotiation';

export interface ApiServiceOptions {
  /**
   * Define additional headers to the HttpRequest.
   */
  headers?: { [name: string]: string };

  /**
   * Define additional query parameters to the HttpRequest.
   */
  params?: { [name: string]: string };

  /**
   * Use a specific format for this request.
   */
  format?: Type<Format>;
}

export interface ApiServiceItemOptions extends ApiServiceOptions {
}

export interface ApiServiceCollectionOptions extends ApiServiceOptions {
  /**
   * Overrides the collection endpoint.
   */
  forceEndpoint?: string;
}

export interface ApiServicePersistOptions extends ApiServiceItemOptions {
}

export interface ApiServiceDeleteOptions extends ApiServiceOptions {
}
