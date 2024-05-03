import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { BookService } from '../../../Service/book.service'; // Adjust the path as needed
import { Book } from '../../../Model/Book'; // Adjust the path as needed

@Component({
  selector: 'app-book-details',
  templateUrl: './bookdetails.component.html',
  styleUrls: ['./bookdetails.component.css']
})
export class BookDetailsComponent implements OnInit {
  book$: Observable<Book | null>;  // Can emit null if there's an error
  error: string | null = null;  // Initialized to null

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService
  ) {
    this.book$ = of(null);  // Initialize with null observable
  }

  ngOnInit(): void {
    this.book$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = +params.get('id')!;  // Non-null assertion if you're sure the ID exists
        return this.bookService.getBookById(id).pipe(
          catchError(error => {
            this.error = "Failed to load book details";  // Set error message
            return of(null);  // Return null observable on error
          })
        );
      })
    );
  }
}
