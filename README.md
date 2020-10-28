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

{
    userId: 1,
    title: "toto",
    createdAt: "2020-10-28T01:00:42+02:00"
}

{
    user: Observable<User>,
    title: "toto",
    createdAt: Date,
}

Normalizer
    normalize(value: any, type: Function): Observable<any>;
    supports(type: Function): bool;
    
Denormalizer
    denormalize(value: any, type: Function): Observable<any>;
    supports(type: Function): bool;

ResourceNormalizer: Normalizer, Denormalizer
    normalize(value: Object, type: Type<any>): Observable<object>;
    denormalize(value: object, type: Type<any>): Observable<Object>;
    supports(type: Type<any>): bool;

