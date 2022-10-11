import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Sort } from '@angular/material/sort';
import { Subject, filter, takeUntil } from 'rxjs';

import { initListCriteria } from '../users.service';
import { FilterType, User, UsersStoreService } from './users-store.service';

@Component({
  selector: 'app-users-container',
  templateUrl: './users-container.component.html',
  styleUrls: ['./users-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UsersStoreService],
})
export class UsersContainerComponent implements OnInit, OnDestroy {
  private unsubscribe = new Subject<void>();

  canClear$ = this.store.canClear$;
  canFilterBySelection$ = this.store.canFilterBySelection$;
  canSelect$ = this.store.canSelect$;
  canUnfilter$ = this.store.canUnfilter$;
  count$ = this.store.count$;
  criteria$ = this.store.criteria$;
  error$ = this.store.error$.pipe(filter((e) => !!e));
  deleteDisabled$ = this.store.deleteDisabled$;
  isAllSelected$ = this.store.isAllSelected$;
  isLoading$ = this.store.isLoading$;
  limit$ = this.store.limit$;
  searchTerm$ = this.store.searchTerm$;
  selectAll$ = this.store.selectAll$;
  users$ = this.store.filteredUsers$;

  constructor(
    private store: UsersStoreService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.store.setState({
      count: 0,
      criteria: initListCriteria(),
      filterType: FilterType.none,
      isLoading: false,
      selectAll: { checked: false },
      selectedUsers: [],
      users: [],
    });
    this.store.listUsers(this.criteria$);
    this.error$
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((e) =>
        this.snackBar.open(e.message, 'Close', { duration: 2500 })
      );
  }

  ngOnDestroy() {
    this.unsubscribe.next();
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

  handlePageIndex(pageIndex: number) {
    this.store.updatePage(pageIndex);
  }

  handleSort($event: Sort) {
    this.store.sort($event);
  }

  handleUnfilter() {
    this.store.unfilter();
  }
}
