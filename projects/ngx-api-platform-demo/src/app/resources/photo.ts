import * as API from 'ngx-api-platform/decorators';
import { Observable } from 'rxjs';
import { Album } from './album';

@API.Resource('photos')
export class Photo
{
  @API.Property({input: false})
  id: number;

  @API.Property()
  title: string;

  @API.Property()
  url: string;

  @API.Property()
  thumbnailUrl: string;

  @API.Property('albumId')
  @API.SubResource(() => Album)
  album: Observable<Album>;
}
