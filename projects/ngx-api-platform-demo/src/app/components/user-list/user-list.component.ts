import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ResourceService, ResourceServiceTokenFor } from 'ngx-api-platform';
import { Subscription } from 'rxjs';
import { User } from '../../resources/user';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
})
export class UserListComponent implements OnInit, OnDestroy {
  users: Array<User>;

  subscription: Subscription;

  constructor(
    @Inject(ResourceServiceTokenFor(User)) private userApiService: ResourceService<User>,
  ) {
  }

  ngOnInit(): void {
    this.userApiService.getCollection().subscribe((users: Array<User>) => this.users = users);
  }

  ngOnDestroy(): void {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
  }
}
