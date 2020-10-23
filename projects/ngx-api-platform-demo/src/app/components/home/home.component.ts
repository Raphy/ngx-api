import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  snippets = {
    configuration: `import ApiPlatformModule from 'ngx-api-platform';
// ...

ApiPlatformModule.forRoot({
  apiBaseUrl: 'https://api.awesome-app.tld', // Set the API base URL where NgxApiPlatfom should request
  resources: [User, Post, ProfilePhoto], // Set the mapped resources
}),`,

    resource: `import * as API from 'ngx-api-platform/decorators';
import { Post } from './post.ts';
import { ProfilePhoto } from './profile-photo.ts';

@API.Resource('users')
export class User
{
  @API.Property({input: false}) // The input option tells to NgxApiPlatform this property will never be sent to the API
  id: string;

  @API.Property()
  emailAddress: string;

  @API.Property({output: false}) // The output option tells to NgxApiPlatform this property will never be sent by the API
  plainPassword: string;

  @API.Property()
  @API.SubResource(() => ProfilePhoto) // Tells to NgxApiPlatform this property is a sub resource of type ProfilePhoto (another mapped resource).
  profilePhoto: Observable<ProfilePhoto>;

  @API.SubCollection(() => Post) // Tells to NgxApiPlatform this property is a sub collection of type Post (another mapped resource).
  posts: Observable<Array<Post>>;
}
`,
    component: `import { Component, Inject, OnInit } from '@angular/core';
import { ApiService, ApiServiceTokenFor } from 'ngx-api-platform';
import { User } from './user';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
})
export class UserComponent implements OnInit, OnDestroy {
  user: User;

  constructor(
    @Inject(ApiServiceTokenFor(User)) private userApiService: ApiService<User>, // <--- The magic is here !
  ) {
  }

  ngOnInit(): void {
    // It will make a request to /users
    this.userApiService.findItem(42).subscribe((user: User) => this.user = user);
  }

}
`,
    template: `<p>Email Address: {{ user?.emailAddress }}</p>
<img [src]="(user?.profilePhoto | async)?.url" [alt]="(user?.profilePhoto | async)?.alt"/>
<div *ngFor="let post of (user?.posts | async)">
  <p>{{ post.title }}</p>
</div>
`
  };


  constructor() { }

  ngOnInit(): void {
  }

}
