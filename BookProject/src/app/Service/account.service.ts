import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl = environment.apiUrl + 'Account/';
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.checkLoginStatus());
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private isAdminSubject = new BehaviorSubject<boolean>(this.checkAdminStatus());
  public isAdmin$ = this.isAdminSubject.asObservable();

  constructor(private http: HttpClient) {}

  private checkLoginStatus(): boolean {
    return sessionStorage.getItem('accountId') !== null;
  }

  private checkAdminStatus(): boolean {
    return sessionStorage.getItem('isAdmin') === 'true';
  }

  private updateLoginStatus(): void {
    const isLoggedIn = this.checkLoginStatus();
    const isAdmin = this.checkAdminStatus();
    this.isLoggedInSubject.next(isLoggedIn);
    this.isAdminSubject.next(isAdmin);
  }

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}login`, credentials, this.getHttpOptions()).pipe(
      tap(response => {
        if (response && response.accountId) {
          sessionStorage.setItem('accountId', response.accountId.toString());
          sessionStorage.setItem('isAdmin', response.isAdmin.toString());
          this.updateLoginStatus();
        }
      }),
      catchError(this.handleError('login', []))
    );
  }


  logout(): void {
    sessionStorage.removeItem('accountId');
    sessionStorage.removeItem('isAdmin');
    this.updateLoginStatus();
  }

  getAllAccounts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}list`).pipe(
      catchError(error => {
        console.error('Error fetching users:', error);
        return throwError(() => new Error('Failed to fetch users'));
      })
    );
  }

  getAllUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}list`).pipe(
      catchError(error => throwError(() => new Error('Error fetching all users: ' + error.message)))
    );
  }

  getUserDetails(accountId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}GetAccInfo/${accountId}`).pipe(
      catchError(error => throwError(() => new Error('Error fetching user details: ' + error.message)))
    );
  }

  register(accountData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}create`, accountData, this.getHttpOptions()).pipe(
      catchError(this.handleError('register', []))
    );
  }

  getAccount(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}GetAccInfo/${id}`, this.getHttpOptions()).pipe(
      catchError(this.handleError('getAccount', {}))
    );
  }

  delAcc(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}deleteAccount/${id}`, this.getHttpOptions()).pipe(
      catchError(this.handleError('deleteAccount', null))
    );
  }

  changeUsername(accountId: number, newUsername: string): Observable<any> {
    return this.http.put(`${this.apiUrl}${accountId}/changeUsername`, { newUsername }, this.getHttpOptions())
      .pipe(
        catchError(error => {
          console.error('Failed to change username:', error);
          return throwError(() => new Error('Failed to change username'));
        })
      );
  }

  changePassword(accountId: number, newPassword: string): Observable<any> {
    return this.http.put(`${this.apiUrl}${accountId}/changePassword`, { newPassword }, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      responseType: 'text'  // Expect a text response, not JSON
    })
    .pipe(
      catchError(error => {
        console.error('Failed to change password:', error);
        return throwError(() => new Error('Failed to change password'));
      })
    );
  }

  changeEmail(accountId: number, newEmail: string): Observable<any> {
    return this.http.put(`${this.apiUrl}${accountId}/changeEmail`, { newEmail }, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      responseType: 'text'  // Expect a text response, not JSON
    })
    .pipe(
      catchError(error => {
        console.error('Failed to update email:', error);
        return throwError(() => new Error('Failed to update email'));
      })
    );
  }

  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: HttpErrorResponse): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return throwError(() => new Error(`Failed to perform ${operation}: ${error.message}`));
    };
  }
}
