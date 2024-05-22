import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Book } from '../Model/Book';
import { BookProgress } from '../Model/BookProject';
import { environment } from '../../environments/environment';

interface ApiResponse {
  data: {
    Media: Book;
  };
}

interface BookListResponse {
  progress: BookProgress[];
  book: Book[];
}

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private readonly apiUrl = environment.apiUrl + "Book/";
  service: any;
  booklist: any;

  constructor(private http: HttpClient) { }

  GetByTitle(title: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const bookRequest = {
      title: title,
      description: '',
      author: '',
      coverImage: ''
    };
    return this.http.post<any>(`${this.apiUrl}GetBookByTitle`, bookRequest, { headers });
  }

  GetBookList(accountId: number): Observable<BookListResponse[]> {
    return this.http.get<BookListResponse[]>(`${this.apiUrl}list/${accountId}`);
  }

  getBookById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}${id}`);
  }

  AddBook(book: Book): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const bookData = {
      ...book,
      coverImage: book.coverImage.large // Ensure coverImage is a string
    };
    return this.http.post<any>(`${this.apiUrl}add`, bookData, { headers }).pipe(
      catchError(error => {
        console.error('Error adding book:', error);
        return throwError(() => new Error('Error adding book'));
      })
    );
  }

  getBookList(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}all`);
  }

  deleteBook(bookId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}delete/${bookId}`);
  }

  deleteBookFromLibrary(accountId: number, bookId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}delete/${bookId}/${accountId}`);
  }

  loanBook(accountId: number, bookId: number, dueDate: Date): Observable<any> {
    const formattedDate = dueDate.toISOString();
    const loanRequest = {
      dueDate: formattedDate
    };
    return this.http.post<any>(`${this.apiUrl}loan/${accountId}/${bookId}`, loanRequest, {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    }).pipe(
      catchError(error => {
        console.error('Error loaning book:', error);
        return throwError(() => new Error('Error loaning book'));
      })
    );
  }

  returnBook(accountId: number, bookId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}return/${accountId}/${bookId}`, {}, {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    }).pipe(
      tap((response: any) => console.log('Response from returnBook:', response)),
      catchError((error: HttpErrorResponse) => {
        console.error('Error returning book:', error);
        return throwError(() => new Error('Error returning book'));
      })
    );
  }

}
