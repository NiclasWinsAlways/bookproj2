import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../../Service/Login.service';
import { AccountService } from '../../../Service/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  UserName: string = '';
  Password: string = '';

  constructor(
    private loginService: LoginService,
    private router: Router,
    private accountService: AccountService
  ) {}

  login() {
    const credentials = { username: this.UserName, password: this.Password };
    this.accountService.login(credentials).subscribe({
      next: (data: any) => {
        console.log('Login response:', data);
        if (data.accountId) {
          sessionStorage.setItem('accountId', data.accountId.toString());
          sessionStorage.setItem('isAdmin', data.isAdmin.toString());
          this.router.navigate(['/library']);
        } else {
          alert('Login failed, please check your credentials and try again.');
        }
      },
      error: (error: any) => {
        console.error('Login error:', error);
        alert('Login failed due to an error. Please try again.');
      },
    });
  }

  logout() {
    console.log('Logging out...');
    this.accountService.logout();
    this.router.navigate(['/login']);
  }

  ngOnInit() {
    console.log('Session storage on page load:', sessionStorage);
  }
}
