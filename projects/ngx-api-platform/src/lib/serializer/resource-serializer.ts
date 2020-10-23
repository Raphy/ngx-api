import { Inject, Injectable } from '@angular/core';
import { MetadataKey, PropertyMetadata, SubResourceMetadata } from '../metadata';
import { assertResource, isResource } from '../utils';
import { API_PLATFORM_SERIALIZERS, Serializer } from './serializer';

@Injectable()
export class ResourceSerializer implements Serializer {
  constructor(
    @Inject(API_PLATFORM_SERIALIZERS) private serializers: Array<Serializer>,
  ) {
  }

  deserialize(value: object, type: Function): Object {
    assertResource(type);

    if (!value) {
      return null;
    }

    const resource = Reflect.construct(type, []);

    // const resourceMetadata: ResourceMetadata = Reflect.getMetadata(MetadataKey.Resource, type);
    const propertiesMetadata: { [propertyName: string]: PropertyMetadata } = Reflect.getMetadata(MetadataKey.Properties, type);
    const subResourcesMetadata: { [propertyName: string]: SubResourceMetadata } = Reflect.getMetadata(MetadataKey.SubResources, type) || {};

    for (const propertyName in propertiesMetadata) {
      const propertyMetadata: PropertyMetadata = propertiesMetadata[propertyName];
      if (propertyMetadata.options.output && value.hasOwnProperty(propertyMetadata.options.name) && !subResourcesMetadata.hasOwnProperty(propertyName)) {
        let serialized = false;

        for (const serializer of this.serializers) {
          if (serializer.supports(propertyMetadata.options.type)) {
            resource[propertyMetadata.propertyName] = serializer.deserialize(value[propertyMetadata.options.name], propertyMetadata.options.type);
            serialized = true;
            break;
          }
        }

        if (!serialized) {
          throw new Error(`There is no serializer that supports the type ${ propertyMetadata.options.type }`);
        }
      }
    }

    return resource;
  }

  serialize(value: Object, type: Function): object {
    assertResource(type);

    if (!value) {
      return null;
    }

    const object: object = {};

    const propertiesMetadata: { [propertyName: string]: PropertyMetadata } = Reflect.getMetadata(MetadataKey.Properties, type);
    const subResourcesMetadata: { [propertyName: string]: SubResourceMetadata } = Reflect.getMetadata(MetadataKey.SubResources, type) || {};

    for (const propertyName in propertiesMetadata) {
      const propertyMetadata: PropertyMetadata = propertiesMetadata[propertyName];
      if (propertyMetadata.options.input && value.hasOwnProperty(propertyMetadata.propertyName) && !subResourcesMetadata.hasOwnProperty(propertyName)) {
        let deserialized = false;

        for (const serializer of this.serializers) {
          if (serializer.supports(propertyMetadata.options.type)) {
            object[propertyMetadata.options.name] = serializer.serialize(value[propertyMetadata.propertyName], propertyMetadata.options.type);
            deserialized = true;
            break;
          }
        }

        if (!deserialized) {
          throw new Error(`There is no serializer that supports the type ${ propertyMetadata.options.type }`);
        }
      }
    }

    return object;

  }

  supports(type: any): boolean {
    return isResource(type);
  }
}
