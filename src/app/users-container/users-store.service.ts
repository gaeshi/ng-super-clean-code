import { Injectable } from '@angular/core';
import { Sort } from '@angular/material/sort';
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
  criteria: ListCriteria;
  error?: any;
  filterType: FilterType;
  isLoading: boolean;
  selectAll: { checked: boolean };
  selectedUsers: User[];
  users: User[];
}

@Injectable()
export class UsersStoreService extends ComponentStore<UsersState> {
  // state selectors:
  criteria$: Observable<ListCriteria> = this.select((s) => s.criteria);
  count$: Observable<number> = this.select((s) => s.count);
  error$: Observable<any> = this.select((s) => s.error);
  filterType$: Observable<FilterType> = this.select((s) => s.filterType);
  isLoading$: Observable<boolean> = this.select((s) => s.isLoading);
  limit$: Observable<number> = this.select((s) => s.criteria.limit);
  searchTerm$: Observable<string> = this.select((s) => s.criteria.search);
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

  filteredUsers$: Observable<User[]> = this.select(
    this.filterType$,
    this.users$,
    this.selectedUsers$,
    (filterType, users, selected) =>
      filterType === FilterType.selection ? selected : users
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

  sort($event: Sort) {
    const currentCriteria = this.get((state) => state.criteria);
    const criteria = {
      ...currentCriteria,
      sortBy: $event.active,
      order: $event.direction,
    };

    this.patchState({ criteria });
  }

  unfilter() {
    const currentCriteria = this.get((state) => state.criteria);
    const criteria = { ...currentCriteria, search: '' };
    this.patchState({ filterType: FilterType.none, criteria });
  }

  updatePage(page: number) {
    const currentCriteria = this.get((state) => state.criteria);
    const criteria = { ...currentCriteria, page };
    this.patchState({ criteria });
  }

  updateSelectAll(checked: boolean) {
    const currentFilterType = this.get((state) => state.filterType);
    const filterType =
      currentFilterType === FilterType.selection
        ? FilterType.none
        : currentFilterType;
    this.patchState({ selectAll: { checked }, filterType });
  }

  updateSearchTerm(search: string) {
    const currentCriteria = this.get((state) => state.criteria);
    const criteria = { ...currentCriteria, search };
    this.patchState({ criteria, filterType: FilterType.search });
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
            error: (error) => this.patchState({ isLoading: false, error }),
          }),
          catchError(() => EMPTY)
        )
      )
    )
  );
}
