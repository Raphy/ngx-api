import { Identifier, Input, Output, Property, Resource, SubCollection, SubResource } from 'ngx-api-platform';
import { Observable } from 'rxjs';
import { Photo } from './photo';
import { User } from './user';

@Resource('albums')
export class Album
{
  @Identifier()
  @Output()
  id: number;

  @Input()
  @Output()
  title: string;

  @Property('userId')
  @Input()
  @Output()
  @SubResource(() => User)
  user: Observable<User>;

  @SubCollection(() => Photo)
  photos: Observable<Array<Photo>>;
}
