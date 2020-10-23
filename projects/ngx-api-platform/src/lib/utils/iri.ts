import { MetadataKey, ResourceMetadata } from '../metadata';
import { assertResource } from './metadata-assert';

export function extractEndpointAndIdentifierFromIri(iri: string): [string, string | number] {
  // An IRI is formatted as : /endpoint/identifier

  const split = iri.substr(1).split('/');

  if (split.length === 0) {
    return [null, null];
  }

  if (split.length === 1) {
    return [split[0], null];
  }

  return [split[0], split[1]];
}

export function resourceIri<TResource extends Object>(resource: TResource): string
{
  assertResource(resource.constructor);

  const resourceMetadata: ResourceMetadata = Reflect.getMetadata(MetadataKey.Resource, resource.constructor);

  return `/${resourceMetadata.options.endpoint}/${resource[resourceMetadata.options.identifierPropertyName]}`;
}
