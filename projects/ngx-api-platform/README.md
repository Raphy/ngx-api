# NgxApiPlatform
NgxApiPlatform is an Angular library to ease the API consumption.

# Demo
A demonstration application is available at https://raphy.github.io/ngx-api-platform/

# Installation

## With Angular Schematics (Work In Progress)
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
