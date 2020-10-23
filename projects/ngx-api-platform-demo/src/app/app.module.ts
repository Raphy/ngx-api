import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ApiPlatformModule } from 'ngx-api-platform';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Album } from './resources/album';
import { Comment } from './resources/comment';
import { Photo } from './resources/photo';
import { Post } from './resources/post';
import { Todo } from './resources/todo';
import { User } from './resources/user';

@NgModule({
  declarations: [
    AppComponent,
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
        Comment
      ],
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
