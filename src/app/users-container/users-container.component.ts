import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { FilterType, User, UsersStoreService } from './users-store.service';

@Component({
  selector: 'app-users-container',
  templateUrl: './users-container.component.html',
  styleUrls: ['./users-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UsersStoreService],
})
export class UsersContainerComponent implements OnInit {
  canClear$ = this.store.canClear$;
  canFilterBySelection$ = this.store.canFilterBySelection$;
  canSelect$ = this.store.canSelect$;
  canUnfilter$ = this.store.canUnfilter$;
  deleteDisabled$ = this.store.deleteDisabled$;
  isAllSelected$ = this.store.isAllSelected$;
  searchTerm$ = this.store.searchTerm$;
  selectAll$ = this.store.selectAll$;
  users$ = this.store.filteredUsers$;

  constructor(private store: UsersStoreService) {}

  ngOnInit(): void {
    this.store.setState({
      filterType: FilterType.none,
      searchTerm: '',
      selectAll: { checked: false },
      selectedUsers: [],
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
    });
  }

  handleClear() {
    this.store.clear();
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

  handleEmitFilterBySelection() {
    this.store.filterBySelection();
  }

  handleUnfilter() {
    this.store.unfilter();
  }
}
