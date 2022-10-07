import { ChangeDetectionStrategy, Component } from '@angular/core';
import { of } from 'rxjs';

import { User } from '../users.service';
import { UsersStoreService } from './users-store.service';

@Component({
  selector: 'app-users-container',
  templateUrl: './users-container.component.html',
  styleUrls: ['./users-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UsersStoreService],
})
export class UsersContainerComponent {
  deleteDisabled$ = of(false);
  users$ = of([
    { name: 'John', surname: 'Doe', email: 'doe@acme.com' },
    { name: 'John', surname: 'Doe', email: 'doe@acme.com' },
    { name: 'John', surname: 'Doe', email: 'doe@acme.com' },
    { name: 'John', surname: 'Doe', email: 'doe@acme.com' },
    { name: 'John', surname: 'Doe', email: 'doe@acme.com' },
    { name: 'John', surname: 'Doe', email: 'doe@acme.com' },
    { name: 'John', surname: 'Doe', email: 'doe@acme.com' },
    { name: 'John', surname: 'Doe', email: 'doe@acme.com' },
    { name: 'John', surname: 'Doe', email: 'doe@acme.com' },
    { name: 'John', surname: 'Doe', email: 'doe@acme.com' },
    { name: 'John', surname: 'Doe', email: 'doe@acme.com' },
    { name: 'John', surname: 'Doe', email: 'doe@acme.com' },
  ]);
  selectAll$ = of(false);

  constructor(private store: UsersStoreService) {}

  handleSelectAll($event: boolean) {}

  handleSearch($event: string) {}

  handleSelectedUsers($event: User[]) {}
}
