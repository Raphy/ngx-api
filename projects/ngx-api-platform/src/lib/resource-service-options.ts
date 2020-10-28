import { HttpHeaders, HttpParams } from '@angular/common/http';

export interface ResourceServiceOptions {
  /**
   * The options interacting with the HTTP request.
   */
  request?: {
    /**
     * The method of the request. The method will override the defined one.
     */
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

    /**
     * The URI of the request, if not set, it will guess it.
     */
    uri?: string;

    /**
     * The headers of the request. The headers will override the defined ones.
     */
    headers?: HttpHeaders;

    /**
     * The params of the request. The params will override the defined ones.
     */
    params?: HttpParams;
  };
}



