import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Denormalizer } from './denormalizer';
import { Normalizer } from './normalizer';
import * as moment_ from 'moment';

const moment = moment_;

@Injectable()
export class DateNormalizer implements Denormalizer, Normalizer {
  denormalize(value: string, type?: Function, context?: object): Observable<Date> {
    // TODO: Add an option of the date format
    return of(moment(value).toDate());
  }

  normalize(value: Date, context?: object): Observable<string> {
    // TODO: Add an option of the date format
    return of(moment(value).toISOString());
  }

  supportsDenormalization(value: any, type?: Function): Observable<boolean> {
    return of(!!value && typeof value === 'string' && !!type && type === Date);
  }

  supportsNormalization(value: any): Observable<boolean> {
    return of(!!value && typeof value === 'object' && value.constructor === Date);
  }
}
