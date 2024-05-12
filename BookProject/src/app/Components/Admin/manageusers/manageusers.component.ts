import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AccountService } from '../../../Service/account.service';

@Component({
  selector: 'app-manageusers',
  templateUrl: './manageusers.component.html',
  styleUrls: ['./manageusers.component.css']
})
export class ManageUsersComponent implements OnInit {
  users: any[] = [];
  selectedUser: any;

  usernameControl = new FormControl('');
  emailControl = new FormControl('');
  passwordControl = new FormControl('');

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  selectUser(user: any): void {
    if (!user || !user.id) {
      console.error('Selected user is invalid or does not have an ID:', user);
      return; // Prevent selection if user or user ID is invalid
    }
    this.selectedUser = user;
    this.usernameControl.setValue(user.username);
    this.emailControl.setValue(user.email);
    this.passwordControl.setValue(''); // Clear password field when selecting a new user
  }

  updateUserDetails(): void {
    if (!this.selectedUser || !this.selectedUser.id) {
      console.error('No user is selected or user has no ID.');
      return; // Ensure there is a selected user with an ID
    }

    const username = this.usernameControl.value || '';
    const email = this.emailControl.value || '';
    const password = this.passwordControl.value || '';

    if (username && username !== this.selectedUser.username) {
      this.accountService.changeUsername(this.selectedUser.id, username).subscribe({
        next: () => console.log('Username updated successfully'),
        error: error => console.error('Failed to update username', error)
      });
    }

    if (email && email !== this.selectedUser.email) {
      this.accountService.changeEmail(this.selectedUser.id, email).subscribe({
        next: () => console.log('Email updated successfully'),
        error: error => console.error('Failed to update email', error)
      });
    }

    if (password) { // Check if password field is not empty
      this.accountService.changePassword(this.selectedUser.id, password).subscribe({
        next: () => {
          console.log('Password updated successfully');
          this.passwordControl.reset(); // Clear the password field after update
        },
        error: error => console.error('Failed to update password', error)
      });
    }
  }

  loadUsers(): void {
    this.accountService.getAllAccounts().subscribe({
      next: (users: any[]) => {
        console.log('Users loaded:', users);
        if (users.some(user => !user.id)) {
          console.error('One or more users are missing an ID:', users);
        }
        this.users = users;
      },
      error: (error: any) => console.error('Failed to load users', error)
    });
  }

  deleteUser(userId: number): void {
    if (!userId) {
      console.error('No userID provided for deletion.');
      return; // Check if userId is valid
    }
    this.accountService.delAcc(userId).subscribe({
      next: () => {
        console.log('User deleted successfully');
        this.loadUsers(); // Reload users after deletion
      },
      error: error => console.error('Error deleting user', error)
    });
  }
}
