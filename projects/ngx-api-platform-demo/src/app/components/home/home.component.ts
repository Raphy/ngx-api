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

    resource: `import { Resource, Identifier, Output, Input, Property, SubResource, SubCollection } from 'ngx-api-platform';
import { Post } from './post.ts';
import { ProfilePhoto } from './profile-photo.ts';

@Resource('users')
export class User
{
  @Identifier() // Define the property containing the resource identifier
  @Output()
  id: string;

  @Input() // The value is sent to the API (POST / PUT)
  @Output() // The value is received from the API
  emailAddress: string;

  @Input()
  plainPassword: string;

  @Input()
  @Output()
  @Property('fullName') // Define the property name of the API body
  name: string;

  @SubResource(() => ProfilePhoto) // This property is a sub resource of type ProfilePhoto (another mapped resource).
  profilePhoto: Observable<ProfilePhoto>;

  @SubCollection(() => Post) // This property is a sub collection of type Post (another mapped resource).
  posts: Observable<Array<Post>>;
}
`,
    component: `import { Component, Inject, OnInit } from '@angular/core';
import { ResourceService, ResourceServiceTokenFor } from 'ngx-api-platform';
import { User } from './user';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
})
export class UserComponent implements OnInit, OnDestroy {
  user: User;

  constructor(
    @Inject(ResourceServiceTokenFor(User)) private userResourceService: ResourceService<User>, // <--- The magic is here !
  ) {
  }

  ngOnInit(): void {
    // It will make a request to /users
    this.userResourceService.getResource(42).subscribe((user: User) => this.user = user);
  }

}
`,
    template: `<p>Email Address: {{ user?.emailAddress }}</p>
<p>Full Name: {{ user?.name }}</p>
<img [src]="(user?.profilePhoto | async)?.url" [alt]="(user?.profilePhoto | async)?.alt"/>
<div *ngFor="let post of (user?.posts | async)">
  <p>{{ post.title }}</p>
</div>
`,
  };

  constructor(
  ) {
  }

  ngOnInit(): void {
  }
}
