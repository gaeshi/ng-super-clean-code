import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { EMPTY, Observable, catchError, switchMap, tap } from 'rxjs';

import { ListCriteria, UsersService } from '../users.service';

export enum FilterType {
  none = 'none',
  search = 'search',
  selection = 'selection',
}

export interface User {
  name: string;
  surname: string;
  email: string;
}

export interface UsersState {
  count: number;
  error?: any;
  filterType: FilterType;
  isLoading: boolean;
  searchTerm: string;
  selectAll: { checked: boolean };
  selectedUsers: User[];
  users: User[];
}

@Injectable()
export class UsersStoreService extends ComponentStore<UsersState> {
  // state selectors:
  count$: Observable<number> = this.select((s) => s.count);
  filterType$: Observable<FilterType> = this.select((s) => s.filterType);
  isLoading$: Observable<boolean> = this.select((s) => s.isLoading);
  searchTerm$: Observable<string> = this.select((s) => s.searchTerm);
  selectAll$: Observable<{ checked: boolean }> = this.select(
    (s) => s.selectAll
  );
  selectedUsers$: Observable<User[]> = this.select((s) => s.selectedUsers);
  users$: Observable<User[]> = this.select((s) => s.users);

  // combined selectors:
  deleteDisabled$: Observable<boolean> = this.select(
    this.selectedUsers$,
    (selectedUsers) => !!selectedUsers && selectedUsers.length < 1
  );

  filteredBySearch$: Observable<User[]> = this.select(
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

  filteredUsers$: Observable<User[]> = this.select(
    this.filterType$,
    this.users$,
    this.selectedUsers$,
    this.filteredBySearch$,
    (filterType, users, selected, filteredBySearch) => {
      switch (filterType) {
        case FilterType.search:
          return filteredBySearch;
        case FilterType.selection:
          return selected;
        default:
          return users;
      }
    }
  );

  isAllSelected$: Observable<boolean> = this.select(
    this.filteredUsers$,
    this.selectedUsers$,
    (filtered, selected) =>
      filtered.length > 0 && filtered.length === selected.length
  );

  canClear$: Observable<boolean> = this.select(
    this.selectedUsers$,
    this.isAllSelected$,
    (selected, isAllSelected) => selected.length > 0 && !isAllSelected
  );

  canSelect$: Observable<boolean> = this.select(
    this.filteredUsers$,
    (filtered) => filtered.length > 0
  );

  canUnfilter$: Observable<boolean> = this.select(
    this.filterType$,
    (filterType) => filterType !== FilterType.none
  );

  canFilterBySelection$: Observable<boolean> = this.select(
    this.selectedUsers$,
    (selected) => selected.length > 0
  );

  constructor(private usersService: UsersService) {
    super();
  }

  // updaters:
  clear() {
    this.patchState({ selectAll: { checked: false }, selectedUsers: [] });
  }

  filterBySelection() {
    if (this.get((state) => state.selectedUsers.length > 0)) {
      this.patchState({ filterType: FilterType.selection });
    }
  }

  unfilter() {
    this.patchState({ filterType: FilterType.none, searchTerm: '' });
  }

  updateSelectAll(checked: boolean) {
    const currentFilterType = this.get((state) => state.filterType);
    const filterType =
      currentFilterType === FilterType.selection
        ? FilterType.none
        : currentFilterType;
    this.patchState({ selectAll: { checked }, filterType });
  }

  updateSearchTerm(searchTerm: string) {
    this.patchState({ searchTerm, filterType: FilterType.search });
  }

  updateSelectedUsers(selectedUsers: User[]) {
    this.patchState({ selectedUsers });
  }

  // effects:
  readonly listUsers = this.effect((criteria$: Observable<ListCriteria>) =>
    criteria$.pipe(
      tap(() => this.patchState({ isLoading: true })),
      switchMap((criteria) =>
        this.usersService.list(criteria).pipe(
          tap({
            next: (response) =>
              this.patchState({
                isLoading: false,
                users: response['results'],
                count: response['count'],
              }),
            error: (error) => this.patchState({ error }),
          }),
          catchError(() => EMPTY)
        )
      )
    )
  );
}
