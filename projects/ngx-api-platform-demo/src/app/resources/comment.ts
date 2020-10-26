import * as API from 'ngx-api-platform/decorators';
import { Observable } from 'rxjs';
import { Post } from './post';

@API.Resource('comments')
export class Comment
{
  @API.Property({input: false})
  id: number;

  @API.Property()
  name: string;

  @API.Property()
  body: string;

  @API.Property()
  email: string;

  @API.Property('postId')
  @API.SubResource(() => Post)
  post: Observable<Post>;
}
