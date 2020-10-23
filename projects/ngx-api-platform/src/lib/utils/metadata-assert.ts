import { PropertyMetadata, ResourceMetadata, SubCollectionMetadata, SubResourceMetadata } from '../metadata';
import { MetadataKey } from '../metadata/metadata-key';

export function assertResourceMetadataExists(ResourceClass: Function): void {
  const resourceMetadata = Reflect.getMetadata(MetadataKey.Resource, ResourceClass);
  if (!resourceMetadata) {
    throw new Error(`The resource "${ ResourceClass.name }" is not an API resource. Did you forgot to use Resource() decorator ?`);
  }
}

export function assertPropertiesMetadataExists(ResourceClass: Function): void {
  const propertiesMetadata = Reflect.getMetadata(MetadataKey.Properties, ResourceClass);
  if (!propertiesMetadata) {
    throw new Error(`The resource "${ ResourceClass.name }" do not contains any API property. Did you forgot to use Property() decorator ?`);
  }
}

export function assertResourceIdentifierPropertyExists(ResourceClass: Function): void {
  assertResourceMetadataExists(ResourceClass);
  assertPropertiesMetadataExists(ResourceClass);

  const resourceMetadata: ResourceMetadata = Reflect.getMetadata(MetadataKey.Resource, ResourceClass);
  const propertiesMetadata: { [propertyName: string]: PropertyMetadata } = Reflect.getMetadata(MetadataKey.Properties, ResourceClass);

  if (!propertiesMetadata.hasOwnProperty(resourceMetadata.options.identifierPropertyName)) {
    throw new Error(`The resource "${ ResourceClass.name }" do not contains the identifier property named "${ resourceMetadata.options.identifierPropertyName }".`);
  }
}

export function assertSubCollectionIsNotProperty(ResourceClass: Function): void {
  assertResourceMetadataExists(ResourceClass);
  assertPropertiesMetadataExists(ResourceClass);

  const subCollectionsMetadata: { [propertyName: string]: SubCollectionMetadata } = Reflect.getMetadata(MetadataKey.SubCollections, ResourceClass);
  if (!subCollectionsMetadata) {
    return;
  }

  const propertiesMetadata: { [propertyName: string]: PropertyMetadata } = Reflect.getMetadata(MetadataKey.Properties, ResourceClass);
  for(const propertyName in subCollectionsMetadata) {
    if (propertiesMetadata.hasOwnProperty(propertyName)) {
      throw new Error(`The resource "${ResourceClass.name}" have the property "${ propertyName }" decorated with Property() and SubCollection() decorators and it's not allowed.`);
    }
  }
}

export function assertSubResourceIsProperty(ResourceClass: Function): void {
  assertResourceMetadataExists(ResourceClass);
  assertPropertiesMetadataExists(ResourceClass);

  const subResourcesMetadata: { [propertyName: string]: SubResourceMetadata } = Reflect.getMetadata(MetadataKey.SubResources, ResourceClass);
  if (!subResourcesMetadata) {
    return;
  }

  const propertiesMetadata: { [propertyName: string]: PropertyMetadata } = Reflect.getMetadata(MetadataKey.Properties, ResourceClass);
  for(const propertyName in subResourcesMetadata) {
    if (!propertiesMetadata.hasOwnProperty(propertyName)) {
      throw new Error(`The resource "${ResourceClass.name}" have the property "${ propertyName }" decorated with SubResource() decorator but the Property() decorators is missing and required.`);
    }
  }
}

export function assertResource(ResourceClass: Function): void {
  assertResourceMetadataExists(ResourceClass);
  assertPropertiesMetadataExists(ResourceClass);
  assertResourceIdentifierPropertyExists(ResourceClass);
  assertSubCollectionIsNotProperty(ResourceClass);
  assertSubResourceIsProperty(ResourceClass);
}

export function isResource(ResourceClass: Function): boolean {
 try {
   assertResourceMetadataExists(ResourceClass);
   assertPropertiesMetadataExists(ResourceClass);
   assertResourceIdentifierPropertyExists(ResourceClass);
 } catch (e) {
   return false;
 }

 return true;
}
