import { Identifier, Input, Output, Property, Resource, SubResource } from 'ngx-api-platform';
import { Observable } from 'rxjs';
import { User } from './user';

@Resource('todos')
export class Todo
{
  @Identifier()
  @Output()
  id: number;

  @Input()
  @Output()
  title: string;

  @Input()
  @Output()
  completed: boolean;

  @Property({name: 'userId'})
  @Input()
  @Output()
  @SubResource(() => User)
  user: Observable<User>;
}
