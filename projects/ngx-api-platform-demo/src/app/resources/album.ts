import * as API from 'ngx-api-platform/mapping/decorators';
import { Observable } from 'rxjs';
import { Photo } from './photo';
import { User } from './user';

@API.Resource('albums')
export class Album
{
  @API.Identifier()
  @API.Output()
  id: number;

  @API.Input()
  @API.Output()
  title: string;

  @API.Property('userId')
  @API.Input()
  @API.Output()
  @API.SubResource(() => User)
  user: Observable<User>;

  @API.SubCollection(() => Photo)
  photos: Observable<Array<Photo>>;
}
