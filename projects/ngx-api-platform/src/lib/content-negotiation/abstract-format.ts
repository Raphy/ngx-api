import { HttpRequest, HttpResponse } from '@angular/common/http';
import { forkJoin, Observable, of, throwError } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Denormalizer, DenormalizerContext, Normalizer, NormalizerContext } from '../normalizers';
import {
  getInputPropertiesMetadata,
  getOutputPropertiesMetadata,
  getPropertiesMetadata,
  getSubCollectionsMetadata,
  getSubResourceMetadata,
  getSubResourcesMetadata,
} from '../utils';
import { Format } from './format';

export abstract class AbstractFormat implements Format {
  protected constructor(
    protected denormalizers: Array<Denormalizer>,
    protected normalizers: Array<Normalizer>,
  ) {
  }

  abstract configureRequest(request: HttpRequest<any>): HttpRequest<any>;

  abstract deserializeCollection<TResource extends object>(Class: Function, body: object): Observable<any>;

  deserializeItem<TResource extends object>(Class: Function, body: object): Observable<TResource> {
    return this.denormalizeItem<TResource>(Class, body);
  }

  serializeItem<TResource extends object>(Class: Function, resource: TResource): Observable<object> {
    return this.normalizeItem<TResource>(Class, resource);
  }

  abstract supportsResponse(response: HttpResponse<any>): boolean;

  protected normalizeItem<TResource extends object>(Class: Function, resource: TResource): Observable<object> {
    return of({})
      .pipe(
        switchMap((body: object) => this.getPropertiesNormalizationObservable(Class, resource, body)),
        switchMap((body: object) => this.getSubResourcesNormalizationObservable(Class, resource, body)),
      )
      ;
  }

  protected denormalizeItem<TResource extends object>(Class: Function, body: object): Observable<TResource> {
    return of(Reflect.construct(Class, []))
      .pipe(
        switchMap((resource: TResource) => this.getPropertiesDenormalizationObservable(Class, resource, body)),
        switchMap((resource: TResource) => this.getSubResourcesDenormalizationObservable(Class, resource, body)),
        switchMap((resource: TResource) => this.getSubCollectionsDenormalizationObservable(Class, resource)),
      )
      ;
  }

  private getPropertiesDenormalizationObservable<TResource extends object>(
    Class: Function,
    resource: TResource,
    body: object,
  ): Observable<TResource> {
    const outputPropertiesMetadata = getOutputPropertiesMetadata(Class);
    const propertyDenormalizationObservables = [];

    for (const propertyMetadata of outputPropertiesMetadata) {
      if (getSubResourceMetadata(Class, propertyMetadata.propertyName)) {
        break;
      }

      let denormalized = false;
      const context: DenormalizerContext = {
        ResourceClass: Class,
        resource,
        propertyName: propertyMetadata.propertyName,
      };

      for (const denormalizer of this.denormalizers) {
        if (denormalizer.supports(propertyMetadata.options.type, context)) {
          propertyDenormalizationObservables.push(
            denormalizer.denormalize(body[propertyMetadata.options.name], propertyMetadata.options.type, context)
              .pipe(
                tap((denormalizedValue) => resource[propertyMetadata.propertyName] = denormalizedValue),
              ),
          );
          denormalized = true;
        }
      }

      if (!denormalized) {
        return throwError(
          `The resource could not be denormalized because an unhandled type of the property "${ propertyMetadata.propertyName }"`,
        );
      }
    }

    if (propertyDenormalizationObservables.length === 0) {
      return of(resource);
    }

    return forkJoin(propertyDenormalizationObservables).pipe(map(() => resource));
  }

  private getSubCollectionsDenormalizationObservable<TResource extends object>(
    Class: Function,
    resource: TResource,
  ): Observable<TResource> {
    const subCollectionsMetadata = getSubCollectionsMetadata(Class);
    const subCollectionDenormalizationObservables = [];

    for (const propertyName in subCollectionsMetadata) {
      if (subCollectionsMetadata.hasOwnProperty(propertyName)) {
        const subCollectionMetadata = subCollectionsMetadata[propertyName];
        const context: DenormalizerContext = {
          ResourceClass: Class,
          resource,
          propertyName: subCollectionMetadata.propertyName,
        };

        for (const denormalizer of this.denormalizers) {
          if (denormalizer.supports(subCollectionMetadata.options.SubResourceClass, context)) {
            subCollectionDenormalizationObservables.push(
              denormalizer.denormalize(null, subCollectionMetadata.options.SubResourceClass, context)
                .pipe(
                  tap((denormalizedValue) => resource[subCollectionMetadata.propertyName] = denormalizedValue),
                ),
            );
          }
        }
      }
    }

    if (subCollectionDenormalizationObservables.length === 0) {
      return of(resource);
    }

    return forkJoin(subCollectionDenormalizationObservables).pipe(map(() => resource));
  }

  private getSubResourcesDenormalizationObservable<TResource extends object>(
    Class: Function,
    resource: TResource,
    body: object,
  ): Observable<TResource> {
    const propertiesMetadata = getPropertiesMetadata(Class);
    const subResourcesMetadata = getSubResourcesMetadata(Class);
    const subResourceDenormalizationObservables = [];

    for (const propertyName in subResourcesMetadata) {
      if (
        subResourcesMetadata.hasOwnProperty(propertyName)
        && propertiesMetadata.hasOwnProperty(propertyName)
        && propertiesMetadata[propertyName].options.output
        && body.hasOwnProperty(propertiesMetadata[propertyName].options.name)
      ) {
        const subResourceMetadata = subResourcesMetadata[propertyName];
        const context: DenormalizerContext = {
          ResourceClass: Class,
          resource,
          propertyName: subResourceMetadata.propertyName,
        };

        for (const denormalizer of this.denormalizers) {
          if (denormalizer.supports(propertiesMetadata[propertyName].options.type, context)) {
            subResourceDenormalizationObservables.push(
              denormalizer.denormalize(
                body[propertiesMetadata[propertyName].options.name],
                propertiesMetadata[propertyName].options.type,
                context,
              )
                .pipe(
                  tap((denormalizedValue) => resource[subResourceMetadata.propertyName] = denormalizedValue),
                ),
            );
          }
        }
      }
    }

    if (subResourceDenormalizationObservables.length === 0) {
      return of(resource);
    }

    return forkJoin(subResourceDenormalizationObservables).pipe(map(() => resource));
  }

  private getPropertiesNormalizationObservable<TResource extends object>(
    Class: Function,
    resource: TResource,
    body: object,
  ): Observable<object> {
    const inputPropertiesMetadata = getInputPropertiesMetadata(Class);
    const propertyNormalizationObservables = [];

    for (const propertyMetadata of inputPropertiesMetadata) {
      if (getSubResourceMetadata(Class, propertyMetadata.propertyName)) {
        break;
      }

      let normalized = false;
      const context: NormalizerContext = {
        ResourceClass: Class,
        resource,
        propertyName: propertyMetadata.propertyName,
      };

      for (const normalizer of this.normalizers) {
        if (normalizer.supports(propertyMetadata.options.type, context)) {
          propertyNormalizationObservables.push(
            normalizer.normalize(resource[propertyMetadata.propertyName], propertyMetadata.options.type, context)
              .pipe(
                tap((normalizedValue) => body[propertyMetadata.options.name] = normalizedValue),
              ),
          );
          normalized = true;
        }
      }

      if (!normalized) {
        return throwError(
          `The resource could not be normalized because an unhandled type of the property "${ propertyMetadata.propertyName }"`,
        );
      }
    }

    if (propertyNormalizationObservables.length === 0) {
      return of(body);
    }

    return forkJoin(propertyNormalizationObservables).pipe(map(() => body));
  }

  private getSubResourcesNormalizationObservable<TResource extends object>(
    Class: Function,
    resource: TResource,
    body: object,
  ): Observable<object> {
    const propertiesMetadata = getPropertiesMetadata(Class);
    const subResourcesMetadata = getSubResourcesMetadata(Class);
    const subResourceNormalizationObservables = [];

    for (const propertyName in subResourcesMetadata) {
      if (
        subResourcesMetadata.hasOwnProperty(propertyName)
        && propertiesMetadata.hasOwnProperty(propertyName)
        && propertiesMetadata[propertyName].options.input
        && resource.hasOwnProperty(propertyName)
      ) {
        const subResourceMetadata = subResourcesMetadata[propertyName];
        const context: NormalizerContext = {
          ResourceClass: Class,
          resource,
          propertyName: subResourceMetadata.propertyName,
        };

        for (const normalizer of this.normalizers) {
          if (normalizer.supports(propertiesMetadata[propertyName].options.type, context)) {
            subResourceNormalizationObservables.push(
              normalizer.normalize(resource[subResourceMetadata.propertyName], propertiesMetadata[propertyName].options.type, context)
                .pipe(
                  tap((normalizedValue) => body[propertiesMetadata[propertyName].options.name] = normalizedValue),
                ),
            );
          }
        }
      }
    }

    if (subResourceNormalizationObservables.length === 0) {
      return of(body);
    }

    return forkJoin(subResourceNormalizationObservables).pipe(map(() => body));
  }
}
