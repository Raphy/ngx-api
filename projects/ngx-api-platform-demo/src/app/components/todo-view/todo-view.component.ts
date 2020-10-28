import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ResourceService, ResourceServiceTokenFor } from 'ngx-api-platform';
import { of, Subscription, zip } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Todo } from '../../resources/todo';

@Component({
  selector: 'app-todo-view',
  templateUrl: './todo-view.component.html',
})
export class TodoViewComponent implements OnInit, OnDestroy {
  activateTabId: string;

  todo: Todo;

  subscription: Subscription;

  constructor(
    @Inject(ResourceServiceTokenFor(Todo)) private todoApiService: ResourceService<Todo>,
    private activatedRoute: ActivatedRoute,
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

          if (params.hasOwnProperty('todo')) {
            return this.todoApiService.getResource(params.todo);
          }

          return of(null);
        }),
      )
      .subscribe((todo: Todo) => this.todo = todo);
  }

  ngOnDestroy(): void {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
  }
}
