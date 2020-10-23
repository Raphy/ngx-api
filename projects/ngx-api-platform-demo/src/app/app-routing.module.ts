import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlbumListComponent } from './components/album-list/album-list.component';
import { AlbumViewComponent } from './components/album-view/album-view.component';
import { HomeComponent } from './components/home/home.component';
import { PostListComponent } from './components/post-list/post-list.component';
import { PostViewComponent } from './components/post-view/post-view.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { TodoViewComponent } from './components/todo-view/todo-view.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserViewComponent } from './components/user-view/user-view.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
  },

  {
    path: 'users',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: UserListComponent,
      },
      {
        path: ':user',
        pathMatch: 'full',
        component: UserViewComponent,
      },
    ]
  },

  {
    path: 'posts',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: PostListComponent,
      },
      {
        path: ':post',
        pathMatch: 'full',
        component: PostViewComponent,
      },
    ]
  },

  {
    path: 'albums',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: AlbumListComponent,
      },
      {
        path: ':album',
        pathMatch: 'full',
        component: AlbumViewComponent,
      },
    ]
  },

  {
    path: 'todos',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: TodoListComponent,
      },
      {
        path: ':todo',
        pathMatch: 'full',
        component: TodoViewComponent,
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
