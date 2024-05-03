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
          sessionStorage.setItem('accountId', data.accountId);
          sessionStorage.setItem('isAdmin',data.isAdmin)
          window.location.href = '/library';
        } else {
          console.log(data);
          alert('Login failed');
        }
      },
      error: (error: Error) => {
        console.log(error);
        alert('Login failed');
      },
    });

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
  }
}
