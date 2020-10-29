import { HttpParams } from '@angular/common/http';
import { Identifier, Input, Output, Property, Resource, SubCollection, SubResource } from 'ngx-api-platform';
import { Observable } from 'rxjs';
import { Comment } from './comment';
import { User } from './user';

@Resource('posts')
export class Post {
  @Identifier()
  @Output()
  id: number;

  @Input()
  @Output()
  title: string;

  @Property('body')
  @Input()
  @Output()
  content: string;

  @Property('userId')
  @Input()
  @Output()
  @SubResource(() => User, {
    resourceServiceOptions: (resource: Post) => {
      return ({request: {params: new HttpParams({fromObject: {test: resource.title}})}});
    }}
    )
  user: Observable<User>;

  @SubCollection(() => Comment)
  comments: Observable<Array<Comment>>;
}
