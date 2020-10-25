import { MetadataKey, PropertyMetadata, ResourceMetadata, SubCollectionMetadata, SubResourceMetadata } from '../metadata';

export function addResourceMetadata(
  Class: Function,
  metadata: ResourceMetadata,
): void {
  Reflect.defineMetadata(MetadataKey.Resource, metadata, Class);
}

export function getResourceMetadata(
  Class: Function)
  : ResourceMetadata {
  if (false === Reflect.hasMetadata(MetadataKey.Resource, Class)) {
    return undefined;
  }

  return Reflect.getMetadata(MetadataKey.Resource, Class);
}

export function addPropertyMetadata(
  Class: Function,
  metadata: PropertyMetadata,
): void {
  if (false === Reflect.hasMetadata(MetadataKey.Properties, Class)) {
    Reflect.defineMetadata(MetadataKey.Properties, {}, Class);
  }

  const definedMetadata: { [propertyName: string]: PropertyMetadata } = Reflect.getMetadata(MetadataKey.Properties, Class);
  definedMetadata[metadata.propertyName] = metadata;
  Reflect.defineMetadata(MetadataKey.Properties, definedMetadata, Class);
}

export function getPropertyMetadata(
  Class: Function,
  propertyName: string,
): PropertyMetadata {
  if (false === Reflect.hasMetadata(MetadataKey.Properties, Class)) {
    return undefined;
  }

  const definedMetadata: { [propertyName: string]: PropertyMetadata } = Reflect.getMetadata(MetadataKey.Properties, Class);
  if (false === definedMetadata.hasOwnProperty(propertyName)) {
    return undefined;
  }

  return definedMetadata[propertyName];
}

export function addSubResourceMetadata(
  Class: Function,
  metadata: SubResourceMetadata,
): void {
  if (false === Reflect.hasMetadata(MetadataKey.SubResources, Class)) {
    Reflect.defineMetadata(MetadataKey.SubResources, {}, Class);
  }

  const definedMetadata: { [propertyName: string]: SubResourceMetadata } = Reflect.getMetadata(MetadataKey.SubResources, Class);
  definedMetadata[metadata.propertyName] = metadata;
  Reflect.defineMetadata(MetadataKey.SubResources, definedMetadata, Class);
}

export function getSubResourceMetadata(
  Class: Function,
  propertyName: string,
): SubResourceMetadata {
  if (false === Reflect.hasMetadata(MetadataKey.SubResources, Class)) {
    return undefined;
  }

  const definedMetadata: { [propertyName: string]: SubResourceMetadata } = Reflect.getMetadata(MetadataKey.SubResources, Class);
  if (false === definedMetadata.hasOwnProperty(propertyName)) {
    return undefined;
  }

  return definedMetadata[propertyName];
}

export function addSubCollectionMetadata(
  Class: Function,
  metadata: SubCollectionMetadata,
): void {
  if (false === Reflect.hasMetadata(MetadataKey.SubCollections, Class)) {
    Reflect.defineMetadata(MetadataKey.SubCollections, {}, Class);
  }

  const definedMetadata: { [propertyName: string]: SubCollectionMetadata } = Reflect.getMetadata(MetadataKey.SubCollections, Class);
  definedMetadata[metadata.propertyName] = metadata;
  Reflect.defineMetadata(MetadataKey.SubCollections, definedMetadata, Class);
}

export function getSubCollectionMetadata(
  Class: Function,
  propertyName: string,
): SubCollectionMetadata {
  if (false === Reflect.hasMetadata(MetadataKey.SubCollections, Class)) {
    return undefined;
  }

  const definedMetadata: { [propertyName: string]: SubCollectionMetadata } = Reflect.getMetadata(MetadataKey.SubCollections, Class);
  if (false === definedMetadata.hasOwnProperty(propertyName)) {
    return undefined;
  }

  return definedMetadata[propertyName];
}
