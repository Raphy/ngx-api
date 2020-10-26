import * as API from 'ngx-api-platform/decorators';
import { Observable } from 'rxjs';
import { Album } from './album';
import { Post } from './post';
import { Todo } from './todo';

@API.Resource('users')
export class User {
  @API.Property({input: false})
  id: number;

  @API.Property()
  name: string;

  @API.Property()
  username: string;

  @API.Property()
  email: string;

  @API.Property()
  website: string;

  @API.Property()
  phone: string;

  @API.SubCollection(() => Post)
  posts: Observable<Array<Post>>;

  @API.SubCollection(
    () => Todo,
    {
      apiServiceCollectionOptions: (resource: User) => ({
        forceEndpoint: 'todos',
        params: {userId: `${ resource.id }`},
      }),
    },
  )
  todos: Observable<Array<Todo>>;

  @API.SubCollection(() => Album)
  albums: Observable<Array<Album>>;
}
