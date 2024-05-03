import { Component } from '@angular/core';
import { AccountService } from '../../Service/account.service';
import { Account } from '../../Model/account';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  acc = {
    email: '',
    isAdmin: false,
    name: '',
    password: '',
    userName: ''
  }
  isopen: boolean = false;
  constructor(private service:AccountService, private router: Router) {}

  ngOnInit(): void {
    this.GetAccount();
  }

  GetAccount() {
    let accountId = sessionStorage.getItem('accountId');
    if (!accountId) return;
    this.service.getAccount(parseInt(accountId)).subscribe((response) => {
      console.log(response);
      this.acc = response;
    });
  }

  DelAcc() {

    let accountId = sessionStorage.getItem('accountId');
    if (!accountId) return;
    this.service.delAcc(parseInt(accountId)).subscribe(() => {
      console.log('Account deleted');
      // Clear the session storage
      sessionStorage.clear();
      // Redirect to the login page
      this.router.navigate(['/login']);
    });
  }
  toggle() {
    this.isopen = !this.isopen;
  }
}
