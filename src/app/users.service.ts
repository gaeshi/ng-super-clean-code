import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';

export interface User {
  name: string;
  surname: string;
  email: string;
}

export interface UsersState {
  users: User[];
}

@Injectable()
export class UsersService extends ComponentStore<UsersState> {
  constructor() {
    super();
  }
}
