import { Identifier, Input, Output, Property, Resource, SubResource } from 'ngx-api-platform';
import { Observable } from 'rxjs';
import { Post } from './post';

@Resource({endpoint: 'comments'})
export class Comment
{
  @Identifier()
  @Output()
  id: number;

  @Input()
  @Output()
  name: string;

  @Input()
  @Output()
  body: string;

  @Input()
  @Output()
  email: string;

  @Property('postId')
  @Input()
  @Output()
  @SubResource(() => Post)
  post: Observable<Post>;
}
