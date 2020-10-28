import { Type } from '@angular/core';
import { IdentifierMetadata } from '../metadata/identifier-metadata';
import { IdentifierOptions } from '../options/identifier-options';
import { addIdentifierMetadata, getPropertyMetadata } from '../../utilities/metadata';
import { Property } from './property';

/**
 * Defines a resource identifier property.
 *
 * @Annotation
 * @publicApi
 */
export function Identifier(): PropertyDecorator;

/**
 * Defines a resource identifier property.
 *
 * @Annotation
 * @publicApi
 */
export function Identifier(options: IdentifierOptions): PropertyDecorator;

/**
 * Defines a resource identifier property.
 */
export function Identifier(options?: IdentifierOptions): PropertyDecorator {
  return (target: Object, propertyName: string): void => {
    options = options || {};

    const metadata: IdentifierMetadata = {
      target: target.constructor as Type<any>,
      propertyName,
      options,
    };

    addIdentifierMetadata(metadata);

    if (!getPropertyMetadata(metadata.target, metadata.propertyName)) {
      Property()(target, propertyName);
    }
  };
}
