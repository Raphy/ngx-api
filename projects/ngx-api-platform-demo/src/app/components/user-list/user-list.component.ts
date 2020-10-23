import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ApiService, ApiServiceTokenFor } from 'ngx-api-platform';
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
    @Inject(ApiServiceTokenFor(User)) private userApiService: ApiService<User>,
  ) {
  }

  ngOnInit(): void {
    this.userApiService.findCollection().subscribe((users: Array<User>) => this.users = users);
  }

  ngOnDestroy(): void {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
  }
}
