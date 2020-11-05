import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocumentationComponent } from './components/documentation/documentation.component';
import { GettingStartedComponent } from './components/documentation/getting-started/getting-started.component';
import { ExamplesComponent } from './components/examples/examples.component';
import { HomeComponent } from './components/home/home.component';
import { AlbumListComponent } from './components/examples/album-list/album-list.component';
import { AlbumViewComponent } from './components/examples/album-view/album-view.component';
import { PostListComponent } from './components/examples/post-list/post-list.component';
import { PostViewComponent } from './components/examples/post-view/post-view.component';
import { TodoListComponent } from './components/examples/todo-list/todo-list.component';
import { TodoViewComponent } from './components/examples/todo-view/todo-view.component';
import { UserListComponent } from './components/examples/user-list/user-list.component';
import { UserViewComponent } from './components/examples/user-view/user-view.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
  },

  {
    path: 'documentation',
    component: DocumentationComponent,
    children: [
      {
        path: 'getting-started',
        component: GettingStartedComponent,
      },

      {
        path: 'mapping',
        children: [
          {
            path: 'resource',
            component: GettingStartedComponent,
          },
          {
            path: 'property',
            component: GettingStartedComponent,
          },
          {
            path: 'identifier',
            component: GettingStartedComponent,
          },
          {
            path: 'input',
            component: GettingStartedComponent,
          },
          {
            path: 'output',
            component: GettingStartedComponent,
          },
          {
            path: 'sub-resource',
            component: GettingStartedComponent,
          },
          {
            path: 'sub-collection',
            component: GettingStartedComponent,
          },

        ],
      },

      {
        path: 'resource-service',
        component: GettingStartedComponent,
      },
    ],
  },

  {
    path: 'examples',
    component: ExamplesComponent,
    children: [
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
        ],
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
        ],
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
        ],
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
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
