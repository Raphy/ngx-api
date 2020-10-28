import { HttpParams } from '@angular/common/http';
import * as API from 'ngx-api-platform/mapping/decorators';
import { Observable } from 'rxjs';
import { Album } from './album';
import { Post } from './post';
import { Todo } from './todo';

@API.Resource('users')
export class User {
  @API.Identifier()
  @API.Output()
  id: number;

  @API.Input()
  @API.Output()
  name: string;

  @API.Input()
  @API.Output()
  username: string;

  @API.Input()
  @API.Output()
  email: string;

  @API.Input()
  @API.Output()
  website: string;

  @API.Input()
  @API.Output()
  phone: string;

  @API.SubCollection({
    type: () => Post,
  })
  posts: Observable<Array<Post>>;

  @API.SubCollection(
    () => Todo,
    {
      resourceServiceOptions: (resource: User) => ({
        request: {
          uri: 'todos',
          params: new HttpParams({fromObject: {userId: `${ resource.id }`}}),
        },
      }),
    },
  )
  todos: Observable<Array<Todo>>;

  @API.SubCollection(() => Album)
  albums: Observable<Array<Album>>;
}
