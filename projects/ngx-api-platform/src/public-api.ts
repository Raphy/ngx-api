/*
 * Public API Surface of ngx-api-platform
 */

export * from './lib/errors/api-platform-error';

export * from './lib/mapping/decorators/identifier';
export * from './lib/mapping/decorators/input';
export * from './lib/mapping/decorators/output';
export * from './lib/mapping/decorators/property';
export * from './lib/mapping/decorators/resource';
export * from './lib/mapping/decorators/sub-collection';
export * from './lib/mapping/decorators/sub-resource';

export * from './lib/mapping/errors/class-metadata-error';
export * from './lib/mapping/errors/mapping-error';
export * from './lib/mapping/errors/property-metadata-error';

export * from './lib/mapping/metadata/identifier-metadata';
export * from './lib/mapping/metadata/input-metadata';
export * from './lib/mapping/metadata/output-metadata';
export * from './lib/mapping/metadata/property-metadata';
export * from './lib/mapping/metadata/resource-metadata';
export * from './lib/mapping/metadata/sub-collection-metadata';
export * from './lib/mapping/metadata/sub-resource-metadata';

export * from './lib/serializer/serializer';

export * from './lib/serializer/errors/serializer-error';

export * from './lib/serializer/normalization/normalizer';
export * from './lib/serializer/normalization/denormalizer';
export * from './lib/serializer/normalization/resource-normalizer';
export * from './lib/serializer/normalization/sub-resource-normalizer';
export * from './lib/serializer/normalization/date-normalizer';

export * from './lib/utilities/metadata';

export * from './lib/api-platform.module';
export * from './lib/api-platform-config';
export * from './lib/resource-service';
