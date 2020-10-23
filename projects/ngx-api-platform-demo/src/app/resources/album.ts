import * as API from 'ngx-api-platform/decorators';
import { Observable } from 'rxjs';
import { Photo } from './photo';
import { User } from './user';

@API.Resource('albums')
export class Album
{
  @API.Property({input: false})
  id: number;

  @API.Property()
  title: string;

  @API.Property('userId')
  @API.SubResource(() => User)
  user: Observable<User>;

  @API.SubCollection(() => Photo)
  photos: Observable<Array<Photo>>;
}
