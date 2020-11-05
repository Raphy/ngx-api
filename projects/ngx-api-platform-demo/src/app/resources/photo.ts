import { Identifier, Input, Output, Property, Resource, SubResource } from 'ngx-api-platform';
import { Observable } from 'rxjs';
import { Album } from './album';

@Resource('photos', {})
export class Photo
{
  @Identifier()
  @Output()
  id: number;

  @Input()
  @Output()
  title: string;

  @Input()
  @Output()
  url: string;

  @Input()
  @Output()
  thumbnailUrl: string;

  @Property('albumId')
  @Input()
  @Output()
  @SubResource(() => Album)
  album: Observable<Album>;
}
