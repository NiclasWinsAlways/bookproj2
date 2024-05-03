import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    // Here you'd include your logic to check if the user is an admin
    // For example, checking if a user has an 'isAdmin' flag in your session storage or user service
    if (sessionStorage.getItem('isAdmin') === 'true') {
      return true;
    } else {
      this.router.navigate(['/login']); // or some other route
      return false;
    }
  }
}
