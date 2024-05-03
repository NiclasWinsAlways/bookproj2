// admin-dashboard.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../../../Service/account.service';  // Adjust the path as necessary

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {
  constructor(
    private accountService: AccountService,  // Service to manage account actions
    private router: Router  // Router for navigation
  ) {}

  // Method to log out the admin and redirect to the login page
  logout(): void {
    this.accountService.logout();  // Assume logout method clears the session and updates isLoggedIn status
    this.router.navigate(['/login']);  // Redirects user to the login page
  }

  // You can add more methods here to interact with your service, like fetching user data or managing books
}
