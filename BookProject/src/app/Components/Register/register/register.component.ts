import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { AccountService } from '../../../Service/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm = new FormGroup({
    Name: new FormControl(''),
    UserName: new FormControl(''),
    Email: new FormControl(''),
    Password: new FormControl(''),
  });

  constructor(private accountService: AccountService, private router: Router) {}

  register() {
    this.accountService.register(this.registerForm.value).subscribe(
      (data: any) => {
        console.log(data);
        // Navigate to the login page after successful registration
        this.router.navigate(['/login']);
      },
      (error: any) => {
        console.log(error);
        alert('Registration failed');
      }
    );
  }
}
