import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ResourceService, ResourceServiceTokenFor } from 'ngx-api-platform';
import { Subscription } from 'rxjs';
import { Post } from '../../resources/post';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Array<Post>;

  subscription: Subscription;

  constructor(
    @Inject(ResourceServiceTokenFor(Post)) private postApiService: ResourceService<Post>,
  ) {
  }

  ngOnInit(): void {
    this.postApiService.getCollection().subscribe((posts: Array<Post>) => this.posts = posts);
  }

  ngOnDestroy(): void {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
  }
}
