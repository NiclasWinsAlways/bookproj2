import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-manage-loans',
  templateUrl: './manageloans.component.html',
  styleUrls: ['./manageloans.component.css']
})
export class ManageLoansComponent implements OnInit {
  loans: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getLoans();
  }

  getLoans(): void {
    this.http.get<any[]>('https://localhost:7236/api/Book/loans')
      .subscribe(
        data => this.loans = data,
        error => console.error('Error fetching loans', error)
      );
  }

  returnBook(bookId: number, accountId: number): void {
    this.http.post(`https://localhost:7236/api/Book/return/${accountId}/${bookId}`, {})
      .subscribe(
        () => this.getLoans(),
        error => console.error('Error returning book', error)
      );
  }
}
