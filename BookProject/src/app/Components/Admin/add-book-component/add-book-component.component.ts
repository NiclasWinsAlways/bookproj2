import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-book-component',
  templateUrl: './add-book-component.component.html',
  styleUrls: ['./add-book-component.component.css']
})
export class AddBookComponentComponent implements OnInit {
  addBookForm!: FormGroup; // Using the non-null assertion operator

  constructor() {}

  ngOnInit(): void {
    this.addBookForm = new FormGroup({
      title: new FormControl('', Validators.required), // Ensuring the title is required
      author: new FormControl(''),
      description: new FormControl(''),
      coverImage: new FormControl('')
    });
  }

  onSubmit(): void {
    if (this.addBookForm.valid) {
      console.log('Form data:', this.addBookForm.value); // Log the form data to the console
    } else {
      console.error('Form is not valid'); // Provide error feedback
    }
  }
}
