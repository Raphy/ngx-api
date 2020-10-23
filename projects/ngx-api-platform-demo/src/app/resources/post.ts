import * as API from 'ngx-api-platform/decorators';
import { Observable } from 'rxjs';
import { Comment } from './comment';
import { User } from './user';

@API.Resource('posts')
export class Post
{
  @API.Property({input: false})
  id: number;

  @API.Property()
  title: string;

  @API.Property()
  body: string;

  @API.Property('userId')
  @API.SubResource(() => User)
  user: Observable<User>;

  @API.SubCollection(() => Comment)
  comments: Observable<Array<Comment>>;
}
