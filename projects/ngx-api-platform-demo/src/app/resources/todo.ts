import * as API from 'ngx-api-platform/decorators';
import { Observable } from 'rxjs';
import { User } from './user';

@API.Resource('todos')
export class Todo
{
  @API.Property({input: false})
  id: number;

  @API.Property()
  title: string;

  @API.Property()
  completed: boolean;

  @API.Property('userId')
  @API.SubResource(() => User)
  user: Observable<User>;
}
