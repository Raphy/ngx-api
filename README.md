# NgxApiPlatform
NgxApiPlatform is an Angular library to ease the API consumption.

# Demo
A demonstration application is available at https://raphy.github.io/ngx-api-platform/

# Installation

## With Angular Schematics
Just run the following command:

```
ng add ngx-api-platform
```

## Manual
Run the following command:
```
yarn add ngx-api-platform
# or
npm install ngx-api-platform
```

Then import the `ApiPlatformModule` in your `AppModule`:

```
ApiPlatformModule.forRoot({
  apiBaseUrl: 'https://api.awesome-app.tld', // Set the API base URL where NgxApiPlatfom should request
  resources: [User, Post, ProfilePhoto], // Set the mapped resources
})
```

Serializer
    constructor(
        @Inject(API_PLATFORM_ENCODERS) private encoders: Array<Encode | Decode>,
        @Inject(API_PLATFORM_ENCODERS) private normalizers: Array<Normalizer | Denormalizer>,
    )
    
    serialize(value: any, format: string): any;
    
    deserialize(value: any, format: string): any;

Encoder
    Decode
        decode(value: string): Observable<object>;
        supportsDecoding(contentType: string): boolean;
    
    Encode
        encode(object: object): Observable<string>;
        supportsEncoding(contentType: string): boolean;
    
    JsonEncoder: Encode, Decode
    
    JsonldHydraEncoder: Encode, Decode
    
Normalizer
    Normalizer
        normalize(value: any): Observable<any>
        supportsNormalization(type: () => Function): boolean

    Denormalizer
        denormalize(value: any): Observable<any>
        supportsDenormalization(type: () => Function): boolean
