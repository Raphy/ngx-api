import { MetadataKey, PropertyMetadata, ResourceMetadata } from '../metadata';

export function getResourceIdentifier<TResource extends object>(resource: TResource): string | number {
  const resourceMetadata: ResourceMetadata = Reflect.getMetadata(MetadataKey.Resource, resource.constructor);

  if (!resource.hasOwnProperty(resourceMetadata.options.identifierPropertyName)) {
    return undefined;
  }

  return resource[resourceMetadata.options.identifierPropertyName];
}

export function getResourceEndpoint(Class: Function): string {
  const resourceMetadata: ResourceMetadata = Reflect.getMetadata(MetadataKey.Resource, Class);

  return resourceMetadata.options.endpoint;
}

export function getObjectPropertyName(Class: Function, resourcePropertyName: string): string {
  const propertiesMetadata: { [propertyName: string]: PropertyMetadata } = Reflect.getMetadata(MetadataKey.Properties, Class);

  if (!propertiesMetadata.hasOwnProperty(resourcePropertyName)) {
    return undefined;
  }

  return propertiesMetadata[resourcePropertyName].propertyName;
}

export function getResourcePropertyName(Class: Function, objectPropertyName: string): string {
  const propertiesMetadata: { [propertyName: string]: PropertyMetadata } = Reflect.getMetadata(MetadataKey.Properties, Class);

  for (const propertyName in propertiesMetadata) {
    if (propertiesMetadata.hasOwnProperty(propertyName) && propertiesMetadata[propertyName].options.name === objectPropertyName) {
      return propertiesMetadata[propertyName].propertyName;
    }
  }

  return undefined;
}
