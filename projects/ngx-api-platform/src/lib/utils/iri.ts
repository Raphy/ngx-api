import { getResourceEndpoint, getResourceIdentifier } from './resource';

export function isIri(subject: any): boolean {
  return typeof subject === 'string' && subject.startsWith('/');
}

export function getEndpointFromIri(iri: string): string {
  const iriParts = iri.split('/');

  if (iriParts.length < 2) {
    return undefined;
  }

  return iriParts[1];
}

export function getIdentifierFromIri(iri: string): string {
  const iriParts = iri.split('/');

  if (iriParts.length < 3) {
    return undefined;
  }

  return iriParts[2];
}

export function getEndpointAndIdentifierFromIri(iri: string): [string, string] {
  const iriParts = iri.split('/');

  if (iriParts.length < 2) {
    return [undefined, undefined];
  }

  if (iriParts.length < 3) {
    return [iriParts[1], undefined];
  }

  return [iriParts[1], iriParts[2]];
}

export function getIriFromResource<TResource extends object>(resoure: TResource): string {
  const endpoint = getResourceEndpoint(resoure.constructor);
  const identifier = getResourceIdentifier(resoure.constructor);

  return `/${ endpoint }/${ identifier }`;
}
