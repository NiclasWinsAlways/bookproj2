import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Book } from '../Model/Book';
import { BookProgress } from '../Model/BookProject';
import { environment } from '../../environments/environment';
//add potential coverimages later
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

  constructor(private http: HttpClient) { }

  GetByTitle(title: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const bookRequest = {
        title: title, // Properly formatted as an object
        description: '', // Added missing colons
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
    const newBook = {
      id: book.id,
      title: book.title,
      description: book.description || "",
      author: book.author || "",
      volumes: book.volumes || 0,
      pages: book.pages || 0,
      coverImage: book.coverImage || ""
    };

    return this.http.post<any>(`${this.apiUrl}add`, newBook);
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

  loanBook(bookId: number, dueDate: Date): Observable<any> {
    return this.http.post(`${this.apiUrl}books/loan/${bookId}`, { dueDate }, { headers: new HttpHeaders({'Content-Type': 'application/json'}) })
      .pipe(
        catchError(error => {
          console.error('Error loaning book:', error);
          return throwError(() => new Error('Error loaning book'));
        })
      );
  }


}



  //observable is somthing that we listen to for data async
//connection to sa server happens like this
//cobber => xmlhttprequest => ajax=> and so on
