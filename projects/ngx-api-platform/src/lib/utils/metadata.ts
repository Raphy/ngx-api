import { MetadataKey, PropertyMetadata, ResourceMetadata, SubCollectionMetadata, SubResourceMetadata } from '../metadata';

export function addResourceMetadata(Class: Function, metadata: ResourceMetadata): void {
  Reflect.defineMetadata(MetadataKey.Resource, metadata, getRealClass(Class));
}

export function getResourceMetadata(Class: Function): ResourceMetadata {
  if (false === Reflect.hasMetadata(MetadataKey.Resource, getRealClass(Class))) {
    return undefined;
  }

  return Reflect.getMetadata(MetadataKey.Resource, getRealClass(Class));
}

export function addPropertyMetadata(Class: Function, metadata: PropertyMetadata): void {
  if (false === Reflect.hasMetadata(MetadataKey.Properties, getRealClass(Class))) {
    Reflect.defineMetadata(MetadataKey.Properties, {}, getRealClass(Class));
  }

  const definedMetadata: { [propertyName: string]: PropertyMetadata } = Reflect.getMetadata(
    MetadataKey.Properties,
    getRealClass(Class),
  );
  definedMetadata[metadata.propertyName] = metadata;
  Reflect.defineMetadata(MetadataKey.Properties, definedMetadata, getRealClass(Class));
}

export function getPropertyMetadata(Class: Function, propertyName: string): PropertyMetadata {
  if (false === Reflect.hasMetadata(MetadataKey.Properties, getRealClass(Class))) {
    return undefined;
  }

  const definedMetadata: { [propertyName: string]: PropertyMetadata } = Reflect.getMetadata(
    MetadataKey.Properties,
    getRealClass(Class),
  );
  if (false === definedMetadata.hasOwnProperty(propertyName)) {
    return undefined;
  }

  return definedMetadata[propertyName];
}

export function getPropertiesMetadata(Class: Function): { [propertyKey: string]: PropertyMetadata } {
  if (false === Reflect.hasMetadata(MetadataKey.Properties, getRealClass(Class))) {
    return {};
  }

  return Reflect.getMetadata(MetadataKey.Properties, getRealClass(Class));
}

export function addSubResourceMetadata(Class: Function, metadata: SubResourceMetadata): void {
  if (false === Reflect.hasMetadata(MetadataKey.SubResources, getRealClass(Class))) {
    Reflect.defineMetadata(MetadataKey.SubResources, {}, getRealClass(Class));
  }

  const definedMetadata: { [propertyName: string]: SubResourceMetadata } = Reflect.getMetadata(
    MetadataKey.SubResources,
    getRealClass(Class),
  );
  definedMetadata[metadata.propertyName] = metadata;
  Reflect.defineMetadata(MetadataKey.SubResources, definedMetadata, getRealClass(Class));
}

export function getSubResourceMetadata(Class: Function, propertyName: string): SubResourceMetadata {
  if (false === Reflect.hasMetadata(MetadataKey.SubResources, getRealClass(Class))) {
    return undefined;
  }

  const definedMetadata: { [propertyName: string]: SubResourceMetadata } = Reflect.getMetadata(
    MetadataKey.SubResources,
    getRealClass(Class),
  );
  if (false === definedMetadata.hasOwnProperty(propertyName)) {
    return undefined;
  }

  return definedMetadata[propertyName];
}

export function getSubResourcesMetadata(Class: Function): { [propertyKey: string]: SubResourceMetadata } {
  if (false === Reflect.hasMetadata(MetadataKey.SubResources, getRealClass(Class))) {
    return {};
  }

  return Reflect.getMetadata(MetadataKey.SubResources, getRealClass(Class));
}

export function addSubCollectionMetadata(Class: Function, metadata: SubCollectionMetadata): void {
  if (false === Reflect.hasMetadata(MetadataKey.SubCollections, getRealClass(Class))) {
    Reflect.defineMetadata(MetadataKey.SubCollections, {}, getRealClass(Class));
  }

  const definedMetadata: { [propertyName: string]: SubCollectionMetadata } = Reflect.getMetadata(
    MetadataKey.SubCollections,
    getRealClass(Class),
  );
  definedMetadata[metadata.propertyName] = metadata;
  Reflect.defineMetadata(MetadataKey.SubCollections, definedMetadata, getRealClass(Class));
}

export function getSubCollectionMetadata(Class: Function, propertyName: string): SubCollectionMetadata {
  if (false === Reflect.hasMetadata(MetadataKey.SubCollections, getRealClass(Class))) {
    return undefined;
  }

  const definedMetadata: { [propertyName: string]: SubCollectionMetadata } = Reflect.getMetadata(
    MetadataKey.SubCollections,
    getRealClass(Class),
  );
  if (false === definedMetadata.hasOwnProperty(propertyName)) {
    return undefined;
  }

  return definedMetadata[propertyName];
}

export function getSubCollectionsMetadata(Class: Function): { [propertyKey: string]: SubCollectionMetadata } {
  if (false === Reflect.hasMetadata(MetadataKey.SubCollections, getRealClass(Class))) {
    return {};
  }

  return Reflect.getMetadata(MetadataKey.SubCollections, getRealClass(Class));
}

export function getOutputPropertiesMetadata(Class: Function): Array<PropertyMetadata> {
  const propertiesMetadata = getPropertiesMetadata(getRealClass(Class));
  const outputPropertiesMetadata: Array<PropertyMetadata> = [];

  for (const propertyName in propertiesMetadata) {
    if (propertiesMetadata.hasOwnProperty(propertyName) && propertiesMetadata[propertyName].options.output) {
      outputPropertiesMetadata.push(propertiesMetadata[propertyName]);
    }
  }

  return outputPropertiesMetadata;
}

export function getInputPropertiesMetadata(Class: Function): Array<PropertyMetadata> {
  const propertiesMetadata = getPropertiesMetadata(getRealClass(Class));
  const inputPropertiesMetadata: Array<PropertyMetadata> = [];

  for (const propertyName in propertiesMetadata) {
    if (propertiesMetadata.hasOwnProperty(propertyName) && propertiesMetadata[propertyName].options.input) {
      inputPropertiesMetadata.push(propertiesMetadata[propertyName]);
    }
  }

  return inputPropertiesMetadata;
}

export function getRealClass(Class: Function): Function {
  try {
    Class();

    return Class();
  } catch (e) {
  }

  return Class;
}
