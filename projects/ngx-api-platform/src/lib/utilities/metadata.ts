import { Type } from '@angular/core';
import { ClassMetadataError } from '../mapping/errors/class-metadata-error';
import { PropertyMetadataError } from '../mapping/errors/property-metadata-error';
import { IdentifierMetadata } from '../mapping/metadata/identifier-metadata';
import { InputMetadata } from '../mapping/metadata/input-metadata';
import { MetadataKey } from '../mapping/metadata/metadata-key';
import { OutputMetadata } from '../mapping/metadata/output-metadata';
import { PropertyMetadata } from '../mapping/metadata/property-metadata';
import { ResourceMetadata } from '../mapping/metadata/resource-metadata';
import { SubCollectionMetadata } from '../mapping/metadata/sub-collection-metadata';
import { SubResourceMetadata } from '../mapping/metadata/sub-resource-metadata';

const targetsAlreadyValidated = [];

export function validateMetadata(target: Type<any>): void {
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

export function getResourceMetadata(target: Type<any>): ResourceMetadata {
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

export function getPropertiesMetadata(target: Type<any>): Array<PropertyMetadata> {
  return Reflect.getMetadata(MetadataKey.Properties, target) || [];
}

export function getPropertyMetadata(target: Type<any>, propertyName: string): PropertyMetadata {
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

export function getSubResourcesMetadata(target: Type<any>): Array<SubResourceMetadata> {
  return Reflect.getMetadata(MetadataKey.SubResources, target) || [];
}

export function getSubResourceMetadata(target: Type<any>, propertyName: string): SubResourceMetadata {
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

export function getSubCollectionsMetadata(target: Type<any>): Array<SubCollectionMetadata> {
  return Reflect.getMetadata(MetadataKey.SubCollections, target) || [];
}

export function getSubCollectionMetadata(target: Type<any>, propertyName: string): SubCollectionMetadata {
  return getSubCollectionsMetadata(target)
    .filter((v: SubCollectionMetadata) => v.propertyName === propertyName)
    .pop()
    ;
}

export function addIdentifierMetadata(metadata: IdentifierMetadata): void {
  Reflect.defineMetadata(MetadataKey.Identifier, metadata, metadata.target);
}

export function getIdentifierMetadata(target: Type<any>): IdentifierMetadata {
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

export function getInputsMetadata(target: Type<any>): Array<InputMetadata> {
  return Reflect.getMetadata(MetadataKey.Inputs, target) || [];
}

export function getInputMetadata(target: Type<any>, propertyName: string): InputMetadata {
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

export function getOutputsMetadata(target: Type<any>): Array<OutputMetadata> {
  return Reflect.getMetadata(MetadataKey.Outputs, target) || [];
}

export function getOutputMetadata(target: Type<any>, propertyName: string): OutputMetadata {
  return getOutputsMetadata(target)
    .filter((v: PropertyMetadata) => v.propertyName === propertyName)
    .pop()
    ;
}
