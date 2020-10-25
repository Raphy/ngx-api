import { HttpRequest, HttpResponse } from '@angular/common/http';
import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export const API_PLATFORM_DEFAULT_FORMAT = new InjectionToken<Format>('API_PLATFORM_DEFAULT_FORMAT');

export interface Format
{
  /**
   * Deserializes the given body into an instance of the given Class.
   */
  deserializeItem<TResource extends object>(Class: Function, body: object): Observable<TResource>;

  /**
   * Serializes a given instance of Class into an object.
   */
  serializeItem<TResource extends object>(Class: Function, resource: TResource): Observable<object>;

  /**
   * Deserializes the given body into an instance of TCollection containing items instance of the given Class.
   */
  deserializeCollection<TResource extends object>(Class: Function, body: object): Observable<any>;

  /**
   * Configures the request sent to the API when using this format.
   */
  configureRequest(request: HttpRequest<any>): HttpRequest<any>;

  /**
   * Checks whether this format supports the request received from the API.
   */
  supportsResponse(response: HttpResponse<any>): boolean;
}
