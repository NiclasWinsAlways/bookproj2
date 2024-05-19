import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
    console.log('Admin guard check, isAdmin:', isAdmin); // Log admin check
    if (!isAdmin) {
      this.router.navigate(['/unauthorized']); // Redirect if not admin
      return false;
    }
    return true;
  }
}
