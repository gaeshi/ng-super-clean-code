import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

@Component({
  selector: 'app-users-actions-panel',
  templateUrl: './users-actions-panel.component.html',
  styleUrls: ['./users-actions-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersActionsPanelComponent implements OnInit, OnDestroy {
  @Input() canClear = true;
  @Input() deleteDisabled = true;
  @Input() set canSelect(canSelect: boolean) {
    if (canSelect) {
      this.form.get('selectAll')?.enable();
    } else {
      this.form.get('selectAll')?.disable();
    }
  }

  @Input() set isAllSelected(isAllSelected: boolean) {
    this.form.get('selectAll')?.setValue(isAllSelected, { emitEvent: false });
  }

  @Output() emitClear = new EventEmitter<void>();
  @Output() emitSearch = new EventEmitter<string>();
  @Output() emitSelectAll = new EventEmitter<boolean>();

  unsubscribe = new Subject<void>();

  form = new FormGroup({
    selectAll: new FormControl(false, { nonNullable: true }),
    search: new FormControl('', { nonNullable: true }),
  });

  selectAllChanges$ = this.form.get('selectAll')!.valueChanges;
  searchChanges$ = this.form.get('search')!.valueChanges;

  ngOnInit(): void {
    this.selectAllChanges$
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((value) => this.emitSelectAll.emit(value));
    this.searchChanges$
      .pipe(
        takeUntil(this.unsubscribe),
        debounceTime(200),
        distinctUntilChanged()
      )
      .subscribe((value) => this.emitSearch.emit(value));
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
  }

  clear() {
    this.emitClear.emit();
  }
}
