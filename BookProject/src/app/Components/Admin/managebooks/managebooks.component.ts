import { Component, OnInit } from '@angular/core';
import { BookService } from '../../../Service/book.service';
import { Book } from '../../../Model/Book';

@Component({
  selector: 'app-manage-books',
  templateUrl: './managebooks.component.html',
  styleUrls: ['./managebooks.component.css']
})
export class ManageBooksComponent implements OnInit {
  books: Book[] = [];
  showAddBookForm = false;
  newBook: Book = new Book();

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.bookService.getBookList().subscribe({
      next: (books: Book[]) => this.books = books,
      error: (error) => console.error('Failed to load books', error)
    });
  }

  addBook(): void {
    this.bookService.AddBook(this.newBook).subscribe({
      next: (response) => {
        console.log('Book added successfully:', response);
        this.books.push(response);
        this.showAddBookForm = false;
        this.newBook = new Book(); // Reset the form model
      },
      error: (error) => console.error('Failed to add book', error)
    });
  }

  deleteBook(bookId: number): void {
    this.bookService.deleteBook(bookId).subscribe({
      next: () => {
        console.log('Book deleted successfully');
        this.books = this.books.filter(book => book.id !== bookId);
      },
      error: (error) => console.error('Failed to delete book', error)
    });
  }
  handleFileInput(event: Event): void {
    const element = event.target as HTMLInputElement;
    const files = element.files;
    if (files && files.length > 0) {
      const file = files[0];
      const fileReader = new FileReader();
      fileReader.onload = () => {
        if (typeof fileReader.result === 'string') {
          this.newBook.coverImage.large = fileReader.result;
        }
      };
      fileReader.readAsDataURL(file);
    }
  }

}
