import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../../Service/Login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  UserName: string = '';
  Password: string = '';

  constructor(private loginService: LoginService, private router: Router) {}

  login() {
    this.loginService.login(this.UserName, this.Password).subscribe({
      next: (data: any) => {
        if (data.accountId) {
          sessionStorage.setItem('accountId', data.accountId.toString());
          sessionStorage.setItem('isAdmin', data.isAdmin.toString());
          this.router.navigate(['/library']); // Using Angular Router to navigate
        } else {
          console.log('Login response:', data); // Log response data for debugging
          alert('Login failed, please check your credentials and try again.');
        }
      },
      error: (error: any) => {
        console.error('Login error:', error);
        alert('Login failed due to an error. Please try again.');
      },
    });
  }
}

    // .subscribe(
    //   (data: any) => {
    //     if (data.accountId) {
    //       sessionStorage.setItem('accountId', data.accountId);
    //       window.location.href = '/library';
    //     } else {
    //       console.log(data);
    //       alert('Login failed');
    //     }
    //   },
    //   (error: any) => {
    //     console.log(error);
    //     alert('Login failed');
    //   }
    // );
