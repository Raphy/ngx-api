import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Denormalizer } from './denormalizer';
import { Normalizer } from './normalizer';

@Injectable()
export class NativeNormalizer implements Normalizer, Denormalizer {
  denormalize(value: any, type: () => Function): Observable<any> {
    return of(Reflect.construct(type, [value]));
  }

  normalize(value: any, type: () => Function): Observable<any> {
    console.log(`${this.constructor.name}::normalize()`, {value, type});
    return of(Reflect.construct(type, [value]));
  }

  supports(type: () => Function): boolean {
    return (type as any) === String
      || (type as any) === Number
      || (type as any) === Boolean;
  }
}
