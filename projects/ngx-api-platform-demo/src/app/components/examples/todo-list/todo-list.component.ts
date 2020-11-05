import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ResourceService, ResourceServiceTokenFor } from 'ngx-api-platform';
import { Subscription } from 'rxjs';
import { Todo } from '../../../resources/todo';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
})
export class TodoListComponent implements OnInit, OnDestroy {
  todos: Array<Todo>;

  subscription: Subscription;

  constructor(
    @Inject(ResourceServiceTokenFor(Todo)) private todoApiService: ResourceService<Todo>,
  ) {
  }

  ngOnInit(): void {
    this.todoApiService.getCollection().subscribe((todos: Array<Todo>) => this.todos = todos);
  }

  ngOnDestroy(): void {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
  }
}
