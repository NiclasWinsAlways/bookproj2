import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Book } from '../../../Model/Book';
import { BookProgress } from '../../../Model/BookProject';
import { VolProgress } from '../../../Model/VolProgress';
import { Volume } from '../../../Model/Volume';
import { BookService } from '../../../Service/book.service';
import { ErrorResponse, VolumeService } from '../../../Service/volume.service';

interface ApiResponse {
  data: {
    Media: Book;
  };
}

interface BookList {
  progress: BookProgress;
  book: Book;
}
// I NEED THIS TO WORK WITH SO I CAN SEE BOOK INFO ON ANOTHER SITE LATER WONT WORK FOR NOW
//WORK ON SITE FOR CHANGE PASSWORD EMAIL USERNAME NEXT TIME
@Component({
  selector: 'BookInfo',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent {
  isLoggedIn: boolean = environment.isLoggedIn;

public booklist:Book[]=[];
public selectedBook?: Book | null; // Allowing null explicitly

public Library: BookList[] = [];
public bookVolumes: Volume[] = [];
// VolumeProgress map
public volumeProgressMap: Map<number, VolProgress> = new Map<number, VolProgress>();

public showModal: boolean = false;
  bookService: any;

//toggleDetails(book:Book) {
  //if (this.showModal) return;
  //book.showdetails = !book.showdetails;
  //if (book.showdetails) {
    //this.showModal = true;
   // this.GetBookVolumes(book.id);
 // }
//}
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
toggleVolume(volume: Volume) {
  volume.showdetails = !volume.showdetails;
}

title:string="";
pagesRead:number=0;
totalPages:number=0;

//it has a DI on the parameter
//this line tells us that we have a prop called service- its a design pattern
constructor(private service:BookService, private volumeService: VolumeService,) {}

ngOnInit(): void {
  this.checkLoginStatus();
  this.GetBookList();
}
private checkLoginStatus(): void {
  const accountId = sessionStorage.getItem('accountId');
  this.isLoggedIn = accountId !== null;
}
// label changes
Title(event:any){
  this.title=event.target.value;
  console.log(this.title);
}

PagesRead(event: any) {
  this.pagesRead = parseInt(event.target.value);
}
TotalPages(event: any) {
  this.totalPages = parseInt(event.target.value);
}


// Book stuff

GetByTitle() {
  if (this.title) {
    this.service.GetByTitle(this.title).subscribe({
      next: (book: Book) => { // Assuming the API response directly returns a Book object.
        if (book) {
          this.booklist.push(book);
          console.log('Book list:', this.booklist);
        } else {
          console.error('Book data is not available in the expected format');
        }
      },
      error: (err: any) => { // Using 'any' to type the error parameter
        console.error('Error fetching book:', err);
        if (err.error && err.error.errors) {
          console.error('Validation errors:', err.error.errors);
        }
      }
    });
  } else {
    console.error('Title is required');
  }
}

AddBook(book: Book) {
  console.log(`AddBook(${book})`)
  const accountId = sessionStorage.getItem('accountId');
  if (!accountId) {
    console.error('No accountId found in session storage');
    return;
  }

  let id: number = Number(accountId);
  this.service.AddBook(book, id).subscribe({
    next: (response: ApiResponse) => {
      window.location.reload();
    },
    error: (err) => console.error('Error adding book:', err)
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



// Volume stuff
GetBookVolumes(bookId: number) {
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

CreateBookVolume(bookId: number) {
  const volumeAmount = this.bookVolumes.length;
  if(volumeAmount < 0 || volumeAmount == null) return;
  let volNumber = volumeAmount + 1;
  this.volumeService.CreateBookVolume(bookId, volNumber).subscribe((response: any) => {
    window.location.reload();
  });

}
deleteBook(bookId:number){
  const accountId = sessionStorage.getItem('accountId');
  if (!accountId) {
    console.log('No accountId found in session storage');
    return;
  }
  this.service.deleteBookFromLibrary(parseInt(accountId),bookId).subscribe(() => {
    console.log('Book deleted');
    window.location.reload();

  });
}


GetPagesRead(volumeId: number): number {
  const progress = this.volumeProgressMap.get(volumeId);
  if (!progress) return 0;
  return progress.pagesRead;
}

UpdatePagesRead(volumeId: number) {
  const progress = this.volumeProgressMap.get(volumeId);
  if (!progress) return;
  progress.pagesRead = this.pagesRead;
  this.volumeService.UpdatePagesRead(progress).subscribe((response: any) => {
    window.location.reload();
  });
}

UpdateTotalPages(volumeId: number) {
  const progress = this.volumeProgressMap.get(volumeId);
  if (!progress) return;;
  this.volumeService.UpdateTotalPages(progress, this.totalPages).subscribe((response: any) => {
    window.location.reload();
  });
}
}
export { Book };

