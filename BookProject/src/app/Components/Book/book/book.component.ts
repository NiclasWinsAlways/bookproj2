import { Component, OnInit } from '@angular/core';
import { BookService } from '../../../Service/book.service';
import { VolumeService } from '../../../Service/volume.service';
import { Book } from '../../../Model/Book';
import { BookProgress } from '../../../Model/BookProject';
import { VolProgress } from '../../../Model/VolProgress';
import { Volume } from '../../../Model/Volume';

@Component({
  selector: 'BookInfo',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;  // Declare isAdmin property
  books: Book[] = [];
  public booklist: Book[] = [];
  public selectedBook?: Book | null;
  public Library: any[] = [];
  public bookVolumes: Volume[] = [];
  public volumeProgressMap: Map<number, VolProgress> = new Map<number, VolProgress>();
  public showModal: boolean = false;
  title: string = "";
  pagesRead: number = 0;
  totalPages: number = 0;

  constructor(private service: BookService, private volumeService: VolumeService) {}

  ngOnInit(): void {
    this.checkLoginStatus();
    this.GetBookList();
  }

  private checkLoginStatus(): void {
    const accountId = sessionStorage.getItem('accountId');
    const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
    this.isLoggedIn = accountId !== null;
    this.isAdmin = isAdmin;
    console.log('Check login status, isLoggedIn:', this.isLoggedIn, 'isAdmin:', this.isAdmin);
  }

  toggleDetails(book: Book): void {
    if (this.showModal) {
      // If modal is open and the same book is selected, close it
      if (this.selectedBook && this.selectedBook.id === book.id) {
        this.closeDetails();
        return;
      }
    }
    this.showModal = true;
    this.service.getBookById(book.id).subscribe({
      next: (fullBookDetails: Book) => {
        this.selectedBook = fullBookDetails;
        console.log('Selected Book Details:', this.selectedBook);
      },
      error: (err: any) => {
        console.error('Error fetching book details:', err);
        this.closeDetails(); // Use closeDetails to reset all modal related states
      }
    });
  }

  closeDetails(): void {
    this.showModal = false; // Close the modal
    this.selectedBook = undefined; // Reset the selected book details
  }

  GetByTitle(): void {
    if (this.title) {
      this.service.GetByTitle(this.title).subscribe({
        next: (book: Book) => {
          if (book) {
            this.booklist.push(book);
            console.log('Book list:', this.booklist);
          } else {
            console.error('Book data is not available in the expected format');
          }
        },
        error: (err: any) => {
          console.error('Error fetching book:', err);
        }
      });
    } else {
      console.error('Title is required');
  }
  }

  AddBook(book: Book): void {
    console.log(`AddBook(${JSON.stringify(book)})`);

    this.service.AddBook(book).subscribe({
      next: (response: any) => {
        console.log('Book added successfully:', response);
        window.location.reload();
      },
      error: (err: any) => console.error('Error adding book:', err)
    });
  }

  GetBookList(): void {
    if (!this.isLoggedIn) {
      console.error('User not logged in, cannot fetch book list');
      return;
    }

    const accountId = sessionStorage.getItem('accountId');
    if (!accountId) {
      console.error('No accountId found in session storage');
      return;
    }

    const numericAccountId = Number(accountId);
    if (isNaN(numericAccountId)) {
      console.error('accountId is not a number');
      return;
    }

    this.service.GetBookList(numericAccountId).subscribe((response: any) => {
      this.booklist = [];
      this.Library = response;
      console.log(this.booklist);
    });
  }

  loanBook(book: Book): void {
    if (!book) {
      console.error('No book provided for loaning.');
      return;
    }

    const accountId = sessionStorage.getItem('accountId');
    if (!accountId) {
      console.error('No accountId found in session storage');
      return;
    }

    const numericAccountId = Number(accountId);
    if (isNaN(numericAccountId)) {
      console.error('accountId is not a number');
      return;
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // Set the loan due date to 14 days in the future.

    this.service.loanBook(numericAccountId, book.id, dueDate).subscribe({
      next: (response: any) => {
        console.log('Book loaned successfully', response);
        book.isLoaned = true; // Update the loaned status
        book.dueDate = dueDate; // Update the due date
      },
      error: (error: any) => {
        console.error('Failed to loan out the book:', error);
        alert('Failed to loan out the book due to an error.'); // Provide user feedback
      }
    });
  }

  returnBook(book: Book): void {
    if (!book) {
      console.error('No book provided for returning.');
      return;
    }

    const accountId = sessionStorage.getItem('accountId');
    if (!accountId) {
      console.error('No accountId found in session storage');
      return;
    }

    const numericAccountId = Number(accountId);
    if (isNaN(numericAccountId)) {
      console.error('accountId is not a number');
      return;
    }

    this.service.returnBook(numericAccountId, book.id).subscribe({
      next: (response: any) => {
        console.log('Book returned successfully', response);
        book.isLoaned = false; // Update the loaned status
        this.updateBookList(book); // Update the book list
      },
      error: (error: any) => {
        console.error('Failed to return the book:', error);
        alert('Failed to return the book due to an error.'); // Provide user feedback
      }
    });
  }

  updateBookList(book: Book): void {
    this.booklist = this.booklist.map(b => b.id === book.id ? { ...b, isLoaned: false } : b);
  }

  GetBookVolumes(bookId: number): void {
    this.volumeService.getBookVolumes(bookId).subscribe((response: any) => {
      this.bookVolumes = response;

      // Verify volume progress
      this.bookVolumes.forEach((volume: Volume) => {
        this.volumeService.VerifyVolumeProgress(volume.volumeId, parseInt(sessionStorage.getItem('accountId') as string), bookId);

        // Get volume progress
        this.volumeService.GetVolumeProgress(volume.volumeId, parseInt(sessionStorage.getItem('accountId') as string)).subscribe((response: VolProgress) => {
          this.volumeProgressMap.set(response.volId, response);
        });
      });
    });
  }

  CreateBookVolume(bookId: number): void {
    const volumeAmount = this.bookVolumes.length;
    if (volumeAmount < 0 || volumeAmount == null) return;
    let volNumber = volumeAmount + 1;
    this.volumeService.CreateBookVolume(bookId, volNumber).subscribe((response: any) => {
      window.location.reload();
    });
  }

  deleteBook(bookId: number): void {
    const accountId = sessionStorage.getItem('accountId');
    if (!accountId) {
      console.log('No accountId found in session storage');
      return;
    }
    this.service.deleteBookFromLibrary(parseInt(accountId), bookId).subscribe(() => {
      console.log('Book deleted');
      window.location.reload();
    });
  }

  GetPagesRead(volumeId: number): number {
    const progress = this.volumeProgressMap.get(volumeId);
    if (!progress) return 0;
    return progress.pagesRead;
  }

  UpdatePagesRead(volumeId: number): void {
    const progress = this.volumeProgressMap.get(volumeId);
    if (!progress) return;
    progress.pagesRead = this.pagesRead;
    this.volumeService.UpdatePagesRead(progress).subscribe((response: any) => {
      window.location.reload();
    });
  }

  UpdateTotalPages(volumeId: number): void {
    const progress = this.volumeProgressMap.get(volumeId);
    if (!progress) return;
    this.volumeService.UpdateTotalPages(progress, this.totalPages).subscribe((response: any) => {
      window.location.reload();
    });
  }
}

export { Book };
