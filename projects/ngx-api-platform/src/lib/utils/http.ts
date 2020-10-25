import { HttpResponse } from '@angular/common/http';

export function getContentType(response: HttpResponse<any>): string {
  if (!response.headers.has('Content-Type')) {
    return undefined;
  }

  const contentTypeHeader = response.headers.get('Content-Type');
  const contentTypeHeaderParts = contentTypeHeader.split(';').map((part) => part.trim());

  if (contentTypeHeaderParts.length < 1) {
    return undefined;
  }

  return contentTypeHeaderParts[0];
}
