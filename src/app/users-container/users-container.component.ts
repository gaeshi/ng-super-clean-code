import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { User, UsersStoreService } from './users-store.service';

@Component({
  selector: 'app-users-container',
  templateUrl: './users-container.component.html',
  styleUrls: ['./users-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UsersStoreService],
})
export class UsersContainerComponent implements OnInit {
  deleteDisabled$ = this.store.deleteDisabled$;
  isAllSelected$ = this.store.isAllSelected$;
  selectAll$ = this.store.selectAll$;
  users$ = this.store.filteredUsers$;

  constructor(private store: UsersStoreService) {}

  ngOnInit(): void {
    this.store.setState({
      users: [
        { name: 'John', surname: 'Doe', email: 'doe@acme.com' },
        { name: 'Maria', surname: 'Doe', email: 'doe@acme.com' },
        { name: 'John', surname: 'Doe', email: 'doe@acme.com' },
        { name: 'John', surname: 'Doe', email: 'doe@acme.com' },
        { name: 'John', surname: 'Doe', email: 'doe@acme.com' },
        { name: 'Maria', surname: 'Doe', email: 'doe@acme.com' },
        { name: 'John', surname: 'Doe', email: 'doe@acme.com' },
        { name: 'John', surname: 'Doe', email: 'doe@acme.com' },
        { name: 'Maria', surname: 'Doe', email: 'doe@acme.com' },
        { name: 'Caroline', surname: 'Doe', email: 'doe@acme.com' },
        { name: 'Caroline', surname: 'Doe', email: 'doe@acme.com' },
        { name: 'John', surname: 'Doe', email: 'doe@acme.com' },
      ],
      selectedUsers: [],
      selectAll: { checked: false },
      searchTerm: '',
    });
  }

  handleSelectAll(selectAll: boolean) {
    this.store.updateSelectAll(selectAll);
  }

  handleSearch(searchTerm: string) {
    this.store.updateSearchTerm(searchTerm);
  }

  handleSelectedUsers(selectedUsers: User[]) {
    this.store.updateSelectedUsers(selectedUsers);
  }
}
