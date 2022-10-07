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
  selectAll: boolean;
  selectedUsers: User[];
  searchTerm: string;
}

@Injectable()
export class UsersStoreService extends ComponentStore<UsersState> {
  // state selectors:
  users$: Observable<User[]> = this.select((s) => s.users);
  selectedUsers$: Observable<User[]> = this.select((s) => s.selectedUsers);
  selectAll$: Observable<boolean> = this.select((s) => s.selectAll);
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

  constructor() {
    super();
  }

  // updaters:
  updateSelectAll(selectAll: boolean) {
    this.patchState({ selectAll });
  }

  updateSearchTerm(searchTerm: string) {
    this.patchState({ searchTerm });
  }

  updateSelectedUsers(selectedUsers: User[]) {
    this.patchState({ selectedUsers });
  }

  // effects:
}
