import { Inject, Injectable, InjectionToken } from '@angular/core';
import * as moment_ from 'moment';
import { Observable, of } from 'rxjs';
import { Denormalizer } from './denormalizer';
import { Normalizer } from './normalizer';

const moment = moment_;

export const API_PLATFORM_DATE_NORMALIZER_FORMAT = new InjectionToken<string>('API_PLATFORM_DATE_NORMALIZER_FORMAT');

export const API_PLATFORM_DEFAULT_DATE_FORMAT = 'Y-MM-DDTHH:mm:ssZ';

@Injectable()
export class DateNormalizer implements Normalizer, Denormalizer {
  constructor(
    @Inject(API_PLATFORM_DATE_NORMALIZER_FORMAT) private dateFormat: string,
  ) {
  }

  denormalize(value: string): Observable<Date> {
    return of(moment(value, this.dateFormat).toDate());
  }

  normalize(value: Date): Observable<string> {
    return of(moment(value).format(this.dateFormat));
  }

  supports(type: () => Function): boolean {
    return (type as any) === Date;
  }
}
