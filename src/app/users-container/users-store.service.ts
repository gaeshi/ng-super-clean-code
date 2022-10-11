import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Observable } from 'rxjs';

export interface User {
  name: string;
  surname: string;
  email: string;
}

export interface UsersState {
  users: User[];
  selectAll: { checked: boolean };
  selectedUsers: User[];
  searchTerm: string;
}

@Injectable()
export class UsersStoreService extends ComponentStore<UsersState> {
  // state selectors:
  users$: Observable<User[]> = this.select((s) => s.users);
  selectedUsers$: Observable<User[]> = this.select((s) => s.selectedUsers);
  selectAll$: Observable<{ checked: boolean }> = this.select(
    (s) => s.selectAll
  );
  searchTerm$: Observable<string> = this.select((s) => s.searchTerm);

  // combined selectors:
  deleteDisabled$: Observable<boolean> = this.select(
    this.selectedUsers$,
    (selectedUsers) => !!selectedUsers && selectedUsers.length < 1
  );

  filteredUsers$: Observable<User[]> = this.select(
    this.users$,
    this.searchTerm$,
    (users, searchTerm) => {
      if (!searchTerm.length) return users;
      else
        return users.filter((u) =>
          u.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
  );

  isAllSelected$: Observable<boolean> = this.select(
    this.filteredUsers$,
    this.selectedUsers$,
    (filtered, selected) => filtered.length === selected.length
  );

  canClear$: Observable<boolean> = this.select(
    this.selectedUsers$,
    this.isAllSelected$,
    (selected, isAllSelected) => selected.length > 0 && !isAllSelected
  );

  constructor() {
    super();
  }

  // updaters:
  clear() {
    this.patchState({ selectAll: { checked: false }, selectedUsers: [] });
  }

  updateSelectAll(checked: boolean) {
    this.patchState({ selectAll: { checked } });
  }

  updateSearchTerm(searchTerm: string) {
    this.patchState({ searchTerm });
  }

  updateSelectedUsers(selectedUsers: User[]) {
    this.patchState({ selectedUsers });
  }

  // effects:
}
