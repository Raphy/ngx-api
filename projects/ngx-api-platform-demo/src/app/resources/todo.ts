import * as API from 'ngx-api-platform/mapping/decorators';
import { Observable } from 'rxjs';
import { User } from './user';

@API.Resource('todos')
export class Todo
{
  @API.Identifier()
  @API.Output()
  id: number;

  @API.Input()
  @API.Output()
  title: string;

  @API.Input()
  @API.Output()
  completed: boolean;

  @API.Property({name: 'userId'})
  @API.Input()
  @API.Output()
  @API.SubResource(() => User)
  user: Observable<User>;
}
