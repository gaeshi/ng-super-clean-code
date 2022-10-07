import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { MatSelectionList } from '@angular/material/list';

import { User } from '../../users.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersListComponent {
  @Input() users: User[];
  @Input() set selectAll(selectAll: boolean) {
    if (!this.usersList) return;
    if (selectAll) {
      this.usersList.selectAll();
      this.emitSelectedUsers.emit(this.users);
    } else {
      this.usersList.deselectAll();
      this.emitSelectedUsers.emit([]);
    }
  }

  @Output() emitSelectedUsers = new EventEmitter<User[]>();

  @ViewChild('usersList') usersList!: MatSelectionList;

  constructor() {
    this.users = [
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
    ];
  }

  selectionChanged() {
    const selectedUsers = this.usersList.selectedOptions.selected.map(
      (s) => s.value
    );

    this.emitSelectedUsers.emit(selectedUsers);
  }
}