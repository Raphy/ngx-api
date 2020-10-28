import * as API from 'ngx-api-platform/mapping/decorators';
import { Observable } from 'rxjs';
import { Post } from './post';

@API.Resource({endpoint: 'comments'})
export class Comment
{
  @API.Identifier()
  @API.Output()
  id: number;

  @API.Input()
  @API.Output()
  name: string;

  @API.Input()
  @API.Output()
  body: string;

  @API.Input()
  @API.Output()
  email: string;

  @API.Property('postId')
  @API.Input()
  @API.Output()
  @API.SubResource(() => Post)
  post: Observable<Post>;
}
