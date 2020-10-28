import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Observable, of } from 'rxjs';
import { Denormalizer } from './denormalizer';
import { Normalizer } from './normalizer';

@Injectable()
export class DateNormalizer implements Normalizer, Denormalizer {
  denormalize(value: string): Observable<Date> {
    return of(moment(value).toDate());
  }

  normalize(value: Date): Observable<string> {
    return of(moment(value).toISOString());
  }

  supportsDenormalization(value: any, type: Function): boolean {
    return type === Date;
  }

  supportsNormalization(value: any, type: Function): boolean {
    return type === Date;
  }
}
