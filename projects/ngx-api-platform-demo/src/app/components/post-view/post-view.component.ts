import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ApiService, ApiServiceTokenFor } from 'ngx-api-platform';
import { of, Subscription, zip } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Post } from '../../resources/post';

@Component({
  selector: 'app-post-view',
  templateUrl: './post-view.component.html',
})
export class PostViewComponent implements OnInit, OnDestroy {
  activateTabId: string;

  post: Post;

  subscription: Subscription;

  constructor(
    @Inject(ApiServiceTokenFor(Post)) private postApiService: ApiService<Post>,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.subscription = zip(
      this.activatedRoute.params,
      this.activatedRoute.fragment,
    )
      .pipe(
        switchMap(([params, fragment]) => {
          this.activateTabId = fragment;

          if (params.hasOwnProperty('post')) {
            return this.postApiService.findItem(params.post);
          }

          return of(null);
        }),
      )
      .subscribe((post: Post) => this.post = post);
  }

  ngOnDestroy(): void {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
  }

  updateFragmentForActiveTab(activeId: string): void {
    if (activeId) {
      this.router.navigate([], {fragment: activeId});
    }
  }
}
