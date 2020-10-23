import { registerLocaleData } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FaConfig, FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { ApiPlatformModule } from 'ngx-api-platform';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AlbumListComponent } from './components/album-list/album-list.component';
import { AlbumViewComponent } from './components/album-view/album-view.component';
import { PostListComponent } from './components/post-list/post-list.component';
import { PostViewComponent } from './components/post-view/post-view.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { TodoViewComponent } from './components/todo-view/todo-view.component';
import { Album } from './resources/album';
import { Comment } from './resources/comment';
import { Photo } from './resources/photo';
import { Post } from './resources/post';
import { Todo } from './resources/todo';
import { User } from './resources/user';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserViewComponent } from './components/user-view/user-view.component';
import { HomeComponent } from './components/home/home.component';

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
    NgbTabsetModule,
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
