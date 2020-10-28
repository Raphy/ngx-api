import * as API from 'ngx-api-platform/mapping/decorators';
import { Observable } from 'rxjs';
import { Album } from './album';

@API.Resource('photos', {})
export class Photo
{
  @API.Identifier()
  @API.Output()
  id: number;

  @API.Input()
  @API.Output()
  title: string;

  @API.Input()
  @API.Output()
  url: string;

  @API.Input()
  @API.Output()
  thumbnailUrl: string;

  @API.Property('albumId')
  @API.Input()
  @API.Output()
  @API.SubResource(() => Album)
  album: Observable<Album>;
}
