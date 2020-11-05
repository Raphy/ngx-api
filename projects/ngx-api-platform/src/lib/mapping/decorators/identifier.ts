import { IdentifierMetadata } from '../metadata';
import { IdentifierOptions } from '../options';
import { addIdentifierMetadata, getPropertyMetadata } from '../utilities';
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
      target: target.constructor,
      propertyName,
      options,
    };

    addIdentifierMetadata(metadata);

    if (!getPropertyMetadata(metadata.target, metadata.propertyName)) {
      Property()(target, propertyName);
    }
  };
}
