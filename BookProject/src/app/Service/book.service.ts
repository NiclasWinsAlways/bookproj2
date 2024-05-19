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
    const formData = new FormData();
    formData.append('title', book.title.english);
    formData.append('description', book.description);
    formData.append('author', book.author);
    formData.append('volumes', book.volumes.toString());
    formData.append('pages', book.pages.toString());
    formData.append('status', book.status);
    formData.append('format', book.format);
    formData.append('showdetails', book.showdetails.toString());
    formData.append('isLoaned', book.isLoaned ? book.isLoaned.toString() : 'false');
    formData.append('dueDate', book.dueDate ? book.dueDate.toISOString() : '');

    if (book.coverImage && book.coverImage.large) {
        // Assuming `large` is a base64 string of the image
        formData.append('coverImage', book.coverImage.large);
    }

    return this.http.post<any>(`${this.apiUrl}add`, formData);
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
    const formattedDate = dueDate.toISOString(); // Ensure date is in ISO 8601 format
    return this.http.post(`${this.apiUrl}loan/${bookId}`, { dueDate: formattedDate }, {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    }).pipe(
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
