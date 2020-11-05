import { ClassMetadataError, PropertyMetadataError } from '../errors';
import {
  IdentifierMetadata,
  InputMetadata,
  MetadataKey,
  OutputMetadata,
  PropertyMetadata,
  ResourceMetadata,
  SubCollectionMetadata,
  SubResourceMetadata,
} from '../metadata';

const targetsAlreadyValidated = [];

export function validateMetadata(target: Function): void {
  // Avoid circular validation
  if (targetsAlreadyValidated.includes(target.name)) {
    return;
  }
  targetsAlreadyValidated.push(target.name);

  // Check if the ResourceMetadata exists
  if (!getResourceMetadata(target)) {
    throw new ClassMetadataError(target, 'Resource() is missing on the class');
  }

  // Check if the IdentifierMetadata exists
  if (!getIdentifierMetadata(target)) {
    throw new ClassMetadataError(target, 'Identifier() is missing on a property');
  }

  // Check if PropertyMetadata exists for the IdentifierMetadata
  if (!getPropertyMetadata(target, getIdentifierMetadata(target).propertyName)) {
    throw new PropertyMetadataError(target, getIdentifierMetadata(target).propertyName, 'Property() is missing on the property');
  }

  // Check if PropertyMetadata exists for the InputMetadata
  getInputsMetadata(target).map((metadata) => {
    if (!getPropertyMetadata(target, metadata.propertyName)) {
      throw new PropertyMetadataError(target, metadata.propertyName, 'Property() is missing on the property');
    }
  });

  // Check if PropertyMetadata exists for the OutputMetadata
  getOutputsMetadata(target).map((metadata) => {
    if (!getPropertyMetadata(target, metadata.propertyName)) {
      throw new PropertyMetadataError(target, metadata.propertyName, 'Property() is missing on the property');
    }
  });

  // Check if PropertyMetadata exists for the SubResourceMetadata and validate the relation
  getSubResourcesMetadata(target).map((metadata) => {
    if (!getPropertyMetadata(target, metadata.propertyName)) {
      throw new PropertyMetadataError(target, metadata.propertyName, 'Property() is missing on the property');
    }

    validateMetadata(metadata.options.type());
  });

  // Validate the relation of SubCollectionMetadata
  getSubCollectionsMetadata(target).map((metadata) => {
    validateMetadata(metadata.options.type());
  });
}

export function addResourceMetadata(metadata: ResourceMetadata): void {
  Reflect.defineMetadata(MetadataKey.Resource, metadata, metadata.target);
}

export function getResourceMetadata(target: Function): ResourceMetadata {
  return Reflect.getMetadata(MetadataKey.Resource, target);
}

export function addPropertyMetadata(metadata: PropertyMetadata): void {
  Reflect.defineMetadata(
    MetadataKey.Properties,
    getPropertiesMetadata(metadata.target)
      .filter((v: PropertyMetadata) => v.propertyName !== metadata.propertyName)
      .concat([metadata]),
    metadata.target);
}

export function getPropertiesMetadata(target: Function): Array<PropertyMetadata> {
  return Reflect.getMetadata(MetadataKey.Properties, target) || [];
}

export function getPropertyMetadata(target: Function, propertyName: string): PropertyMetadata {
  return getPropertiesMetadata(target)
    .filter((v: PropertyMetadata) => v.propertyName === propertyName)
    .pop()
    ;
}

export function addSubResourceMetadata(metadata: SubResourceMetadata): void {
  Reflect.defineMetadata(
    MetadataKey.SubResources,
    getSubResourcesMetadata(metadata.target)
      .filter((v: SubResourceMetadata) => v.propertyName !== metadata.propertyName)
      .concat([metadata]),
    metadata.target);
}

export function getSubResourcesMetadata(target: Function): Array<SubResourceMetadata> {
  return Reflect.getMetadata(MetadataKey.SubResources, target) || [];
}

export function getSubResourceMetadata(target: Function, propertyName: string): SubResourceMetadata {
  return getSubResourcesMetadata(target)
    .filter((v: SubResourceMetadata) => v.propertyName === propertyName)
    .pop()
    ;
}

export function addSubCollectionMetadata(metadata: SubCollectionMetadata): void {
  Reflect.defineMetadata(
    MetadataKey.SubCollections,
    getSubCollectionsMetadata(metadata.target)
      .filter((v: SubCollectionMetadata) => v.propertyName !== metadata.propertyName)
      .concat([metadata]),
    metadata.target);
}

export function getSubCollectionsMetadata(target: Function): Array<SubCollectionMetadata> {
  return Reflect.getMetadata(MetadataKey.SubCollections, target) || [];
}

export function getSubCollectionMetadata(target: Function, propertyName: string): SubCollectionMetadata {
  return getSubCollectionsMetadata(target)
    .filter((v: SubCollectionMetadata) => v.propertyName === propertyName)
    .pop()
    ;
}

export function addIdentifierMetadata(metadata: IdentifierMetadata): void {
  Reflect.defineMetadata(MetadataKey.Identifier, metadata, metadata.target);
}

export function getIdentifierMetadata(target: Function): IdentifierMetadata {
  return Reflect.getMetadata(MetadataKey.Identifier, target);
}

export function addInputMetadata(metadata: InputMetadata): void {
  Reflect.defineMetadata(
    MetadataKey.Inputs,
    getInputsMetadata(metadata.target)
      .filter((v: PropertyMetadata) => v.propertyName !== metadata.propertyName)
      .concat([metadata]),
    metadata.target);
}

export function getInputsMetadata(target: Function): Array<InputMetadata> {
  return Reflect.getMetadata(MetadataKey.Inputs, target) || [];
}

export function getInputMetadata(target: Function, propertyName: string): InputMetadata {
  return getInputsMetadata(target)
    .filter((v: PropertyMetadata) => v.propertyName === propertyName)
    .pop()
    ;
}

export function addOutputMetadata(metadata: OutputMetadata): void {
  Reflect.defineMetadata(
    MetadataKey.Outputs,
    getOutputsMetadata(metadata.target)
      .filter((v: PropertyMetadata) => v.propertyName !== metadata.propertyName)
      .concat([metadata]),
    metadata.target);
}

export function getOutputsMetadata(target: Function): Array<OutputMetadata> {
  return Reflect.getMetadata(MetadataKey.Outputs, target) || [];
}

export function getOutputMetadata(target: Function, propertyName: string): OutputMetadata {
  return getOutputsMetadata(target)
    .filter((v: PropertyMetadata) => v.propertyName === propertyName)
    .pop()
    ;
}
