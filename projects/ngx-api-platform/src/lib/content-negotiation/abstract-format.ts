import { HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Format } from './format';

export abstract class AbstractFormat implements Format {
  abstract configureRequest(request: HttpRequest<any>): HttpRequest<any>;

  abstract deserializeCollection<TResource extends object>(Class: Function, body: object): Observable<any>;

  abstract deserializeItem<TResource extends object>(Class: Function, body: object): Observable<TResource>;

  abstract serializeItem<TResource extends object>(Class: Function, resource: TResource): Observable<object>;

  abstract supportsResponse(response: HttpResponse<any>): boolean;
}
