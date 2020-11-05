import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FaConfig, FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ApiPlatformModule } from 'ngx-api-platform';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DocumentationComponent } from './components/documentation/documentation.component';
import { GettingStartedComponent } from './components/documentation/getting-started/getting-started.component';
import { AlbumListComponent } from './components/examples/album-list/album-list.component';
import { AlbumViewComponent } from './components/examples/album-view/album-view.component';
import { ExamplesComponent } from './components/examples/examples.component';
import { PostListComponent } from './components/examples/post-list/post-list.component';
import { PostViewComponent } from './components/examples/post-view/post-view.component';
import { TodoListComponent } from './components/examples/todo-list/todo-list.component';
import { TodoViewComponent } from './components/examples/todo-view/todo-view.component';
import { UserListComponent } from './components/examples/user-list/user-list.component';
import { UserViewComponent } from './components/examples/user-view/user-view.component';
import { HomeComponent } from './components/home/home.component';
import { Album } from './resources/album';
import { Comment } from './resources/comment';
import { Photo } from './resources/photo';
import { Post } from './resources/post';
import { Todo } from './resources/todo';
import { User } from './resources/user';

@NgModule({
  declarations: [
    AppComponent,
    UserListComponent,
    UserViewComponent,
    PostListComponent,
    PostViewComponent,
    AlbumListComponent,
    TodoListComponent,
    TodoViewComponent,
    AlbumViewComponent,
    HomeComponent,
    ExamplesComponent,
    DocumentationComponent,
    GettingStartedComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ApiPlatformModule.forRoot({
      apiBaseUrl: 'https://jsonplaceholder.typicode.com',
      resources: [
        User,
        Post,
        Todo,
        Album,
        Photo,
        Comment,
      ],
    }),
    FontAwesomeModule,
    NgbModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(faLibrary: FaIconLibrary, faConfig: FaConfig) {
    faLibrary.addIconPacks(fas, far, fab);
    faConfig.fixedWidth = true;
  }
}
