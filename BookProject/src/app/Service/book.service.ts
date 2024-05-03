import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
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
  private readonly apiUrl = environment.apiUrl + "Book/"; // Adjust to match the route in your API

  constructor(private http: HttpClient) { }

  GetByTitle(title: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const bookRequest = {
        title: title, // Only send title if that's all you need
        description: '', // Send empty strings if necessary to avoid null issues
        author: '',
        coverImage: ''
    };
    return this.http.post<any>(this.apiUrl + 'GetBookByTitle', bookRequest, { headers });
}


  GetBookList(accountId: number): Observable<BookListResponse[]> {
    // Assuming 'GetBookList' is a GET request that takes accountId as a route parameter
    return this.http.get<BookListResponse[]>(`${this.apiUrl}list/${accountId}`);
  }
  getBookById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}${id}`).pipe(

    );
}
  AddBook(book: Book, accountId: number): Observable<ApiResponse> {
    // Adjusting the newBook object to fit what your API expects
    const newBook = {
      id: book.id,
      title: book.title.english || book.title.romaji,
      description: book.description || "", // default to an empty string if undefined
      author: book.author || "", // default to an empty string if undefined
      volumes: book.volumes || 0, // default to 0 if undefined
      pages: book.pages || 0, // default to 0 if undefined
      coverImage: book.coverImage.large || "" // default to an empty string if undefined
    };

    // Assuming 'DbAddBook' should actually be 'add/{accountId}' as defined in your controller
    return this.http.post<ApiResponse>(`${this.apiUrl}add/${accountId}`, newBook);
  }

  deleteBookFromLibrary(accountId: number, bookId: number): Observable<any> {
    // Update the endpoint to match the actual API endpoint for deleting a book
    return this.http.delete(`${this.apiUrl}${bookId}/${accountId}`);
  }

  // implement other methods as needed and ensure they match your API's routes
}




  //observable is somthing that we listen to for data async
//connection to sa server happens like this
//cobber => xmlhttprequest => ajax=> and so on
