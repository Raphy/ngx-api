import * as API from 'ngx-api-platform/mapping/decorators';
import { Observable } from 'rxjs';
import { Comment } from './comment';
import { User } from './user';

@API.Resource('posts')
export class Post
{
  @API.Identifier()
  @API.Output()
  id: number;

  @API.Input()
  @API.Output()
  title: string;

  @API.Property('body')
  @API.Input()
  @API.Output()
  content: string;

  @API.Property('userId')
  @API.Input()
  @API.Output()
  @API.SubResource(() => User)
  user: Observable<User>;

  @API.SubCollection(() => Comment)
  comments: Observable<Array<Comment>>;
}
