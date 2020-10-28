import { HttpParams } from '@angular/common/http';
import { Identifier, Input, Output, Resource, SubCollection } from 'ngx-api-platform';
import { Observable } from 'rxjs';
import { Album } from './album';
import { Post } from './post';
import { Todo } from './todo';

@Resource('users')
export class User {
  @Identifier()
  @Output()
  id: number;

  @Input()
  @Output()
  name: string;

  @Input()
  @Output()
  username: string;

  @Input()
  @Output()
  email: string;

  @Input()
  @Output()
  website: string;

  @Input()
  @Output()
  phone: string;

  @SubCollection({
    type: () => Post,
  })
  posts: Observable<Array<Post>>;

  @SubCollection(
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

  @SubCollection(() => Album)
  albums: Observable<Array<Album>>;
}
