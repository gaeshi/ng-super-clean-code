import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, delay, throwError } from 'rxjs';

import { User } from './users-container/users-store.service';

export interface ListCriteria {
  limit: number;
  order: string;
  page: number;
  search: string;
  sortBy: string;
}

export const initListCriteria = () => ({
  limit: 10,
  order: 'asc',
  page: 1,
  search: '',
  sortBy: 'createdAt',
});

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  apiUrl = 'https://624bf5d171e21eebbcf82294.mockapi.io/api/users';

  constructor(private http: HttpClient) {}

  list = (
    criteria: ListCriteria
  ): Observable<{ results: User[]; count: number }> =>
    this.http
      .get<{ results: User[]; count: number }>(this.apiUrl, {
        params: <any>criteria,
      })
      .pipe(delay(2000), catchError(this.handleError));

  delete = (userId: number): Observable<User[]> =>
    this.http
      .delete<User[]>(`${this.apiUrl}/${userId}`)
      .pipe(catchError(this.handleError));

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was:`,
        error.error
      );
    }
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }
}
