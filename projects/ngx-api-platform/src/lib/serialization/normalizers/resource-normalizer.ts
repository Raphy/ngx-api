import { Injectable, Injector } from '@angular/core';
import { map, mapTo, switchMap, tap } from 'rxjs/operators';
import { forkJoin, Observable, of } from 'rxjs';
import { ResourceService } from '../../resource-service';
import { Denormalizer } from './denormalizer';
import { Normalizer } from './normalizer';
import { Serializer } from '../serializer';
import {
  getIdentifierMetadata,
  getInputMetadata,
  getOutputMetadata,
  getPropertiesMetadata,
  getResourceMetadata,
  getSubCollectionsMetadata,
  getSubResourceMetadata,
  PropertyMetadata,
  SubCollectionMetadata,
  SubResourceMetadata,
} from '../../mapping';

@Injectable()
export class ResourceNormalizer implements Denormalizer, Normalizer {
  get serializer(): Serializer {
    return this.injector.get<Serializer>(Serializer);
  }

  constructor(private injector: Injector) {
  }

  denormalize(value: object, type: Function, context?: object): Observable<Object> {
    return of(Reflect.construct(type, []))
      .pipe(
        switchMap((resource) => this.denormalizeProperties(resource, value, context)),
        switchMap((resource) => this.denormalizeSubCollectionProperties(resource)),
      )
      ;
  }

  normalize(value: Object, context?: object): Observable<object> {
    return of({})
      .pipe(
        switchMap((object) => this.normalizeProperties(object, value, context)),
      )
      ;
  }

  supportsDenormalization(value: any, type: Function): Observable<boolean> {
    return of(!!value && typeof value === 'object' && !!getResourceMetadata(type));
  }

  supportsNormalization(value: any): Observable<boolean> {
    return of(!!value && typeof value === 'object' && !!getResourceMetadata(value.constructor));
  }

  getDenormalizationOrder(): number {
    return 0;
  }

  getNormalizationOrder(): number {
    return 0;
  }

  private denormalizeProperties(resource: Object, value: object, context?: object): Observable<Object> {
    return of(getPropertiesMetadata(resource.constructor))
      .pipe(
        switchMap((propertiesMetadata: Array<PropertyMetadata>) => {
          if (propertiesMetadata.length === 0) {
            return of(resource);
          }

          if (context && context.hasOwnProperty('direction') && context['direction'] === 'output') {
            propertiesMetadata = propertiesMetadata.filter((pm) => getOutputMetadata(pm.target, pm.propertyName));
          }

          return forkJoin(propertiesMetadata.map((propertyMetadata) => {
            const subResourceMetadata = getSubResourceMetadata(resource.constructor, propertyMetadata.propertyName);
            if (subResourceMetadata) {
              return this.denormalizeSubResourceProperty(
                resource,
                value[propertyMetadata.options.name],
                propertyMetadata,
                subResourceMetadata,
              );
            }

            return this.denormalizeRegularProperty(
              resource,
              value[propertyMetadata.options.name],
              propertyMetadata,
              context,
            );
          }));
        }),
        mapTo(resource),
      )
      ;
  }

  private denormalizeRegularProperty(resource: Object, value: any, propertyMetadata: PropertyMetadata, context ?: object): Observable<any> {
    return this.serializer.denormalize(value, propertyMetadata.options.type, context)
      .pipe(
        tap((denormalizedValue) => resource[propertyMetadata.propertyName] = denormalizedValue),
      );
  }

  private denormalizeSubResourceProperty(
    resource: Object,
    value: any,
    propertyMetadata: PropertyMetadata,
    subResourceMetadata: SubResourceMetadata,
  ): Observable<any> {
    const subResourceResourceMetadata = getResourceMetadata(subResourceMetadata.options.type());

    return of(null)
      .pipe(
        map(() => {
          if (!value) {
            return null;
          }

          if (typeof value === 'object' && value.constructor === subResourceMetadata.target) {
            return of(value);
          }

          return of(null)
            .pipe(
              switchMap(() => {
                const resourceServiceOptions = Object.assign({}, typeof subResourceMetadata.options.resourceServiceOptions === 'function'
                  ? subResourceMetadata.options.resourceServiceOptions(resource)
                  : (subResourceMetadata.options.resourceServiceOptions || {}));

                let identifier = value;
                // Handle IRI
                if (typeof value === 'string' && value.startsWith(`/${ subResourceResourceMetadata.options.endpoint }/`)) {
                  identifier = value.substring(`/${ subResourceResourceMetadata.options.endpoint }/`.length);
                } else if (typeof value === 'object' && !!getResourceMetadata(value)) {
                  const identifierMetadata = getIdentifierMetadata(value);
                  identifier = value[identifierMetadata.propertyName];
                }

                return this.getResourceService(subResourceMetadata.options.type()).getResource(identifier, resourceServiceOptions);
              }),
            );
        }),
        tap((denormalizedValue) => {
          resource[propertyMetadata.propertyName] = denormalizedValue;
        }),
      );


  }

  private denormalizeSubCollectionProperties(resource: Object): Observable<Object> {
    return of(getSubCollectionsMetadata(resource.constructor))
      .pipe(
        tap((subCollectionsMetadata: Array<SubCollectionMetadata>) => {
          subCollectionsMetadata.map((subCollectionMetadata) => {
            resource[subCollectionMetadata.propertyName] = of(null)
              .pipe(
                switchMap(() => {
                  const resourceServiceOptions = Object.assign({}, typeof subCollectionMetadata.options.resourceServiceOptions === 'function'
                    ? subCollectionMetadata.options.resourceServiceOptions(resource)
                    : (subCollectionMetadata.options.resourceServiceOptions || {}));

                  resourceServiceOptions.request = Object.assign({}, resourceServiceOptions.request || {});
                  if (!resourceServiceOptions.request.uri) {
                    const resourceMetadata = getResourceMetadata(resource.constructor);
                    const identifierMetadata = getIdentifierMetadata(resource.constructor);
                    const resourceEndpoint = resourceMetadata.options.endpoint;
                    const resourceIdentifier = resource[identifierMetadata.propertyName];
                    resourceServiceOptions.request.uri = `/${ resourceEndpoint }/${ resourceIdentifier }/${ subCollectionMetadata.propertyName }`;
                  }

                  return this.getResourceService(subCollectionMetadata.options.type()).getCollection(resourceServiceOptions);
                }),
              );
          });
        }),
        mapTo(resource),
      );
  }

  private normalizeProperties(object: object, value: Object, context?: object): Observable<Object> {
    return of(getPropertiesMetadata(value.constructor))
      .pipe(
        switchMap((propertiesMetadata: Array<PropertyMetadata>) => {
          if (propertiesMetadata.length === 0) {
            return of(object);
          }

          if (context && context.hasOwnProperty('direction') && context['direction'] === 'input') {
            propertiesMetadata = propertiesMetadata.filter((pm) => getInputMetadata(pm.target, pm.propertyName));
          }

          return forkJoin(propertiesMetadata.map((propertyMetadata) => {
            const subResourceMetadata = getSubResourceMetadata(value.constructor, propertyMetadata.propertyName);
            if (subResourceMetadata) {
              return this.normalizeSubResourceProperty(object, value[propertyMetadata.propertyName], propertyMetadata);
            }

            return this.normalizeRegularProperty(object, value[propertyMetadata.propertyName], propertyMetadata, context);
          }));
        }),
        mapTo(object),
      )
      ;
  }

  private normalizeRegularProperty(object: object, value: any, propertyMetadata: PropertyMetadata, context?: object): Observable<any> {
    return this.serializer.normalize(value, context)
      .pipe(
        tap((normalizedValue) => object[propertyMetadata.options.name] = normalizedValue),
      );
  }

  private normalizeSubResourceProperty(object: object, value: Observable<any>, propertyMetadata: PropertyMetadata): Observable<any> {
    return value.pipe(
      map((subResource) => {
        const identifierMetadata = getIdentifierMetadata(subResource.constructor);
        object[propertyMetadata.options.name] = subResource[identifierMetadata.propertyName];
      }),
    );
  }

  private getResourceService(type: Function): ResourceService<any> {
    return new ResourceService<any>(type, this.injector);
  }
}
