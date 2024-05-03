import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../../../Service/account.service'; // Ensure the path is correct

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false; // Tracks the login state
  isAdmin: boolean = false; // Tracks if the user is an admin
  public isDropdownOpen: boolean = false;

  constructor(private router: Router, private accountService: AccountService) {}

  ngOnInit(): void {
    // Subscribe to the observable to receive updates for isLoggedIn
    this.accountService.isLoggedIn$.subscribe((status: boolean) => {
      this.isLoggedIn = status;
    });

    // Subscribe to the observable to receive updates for isAdmin
    this.accountService.isAdmin$.subscribe((admin: boolean) => {
      this.isAdmin = admin;
    });
  }

  logout(): void {
    // Delegate the logout logic to the account service
    this.accountService.logout();

    // Use Angular router to navigate to enhance SPA behavior
    this.router.navigate(['/login']);
  }

  // Method to toggle the dropdown menu
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  // Optional: Close the dropdown if clicked outside
  closeDropdown(): void {
    this.isDropdownOpen = false;
  }
}
