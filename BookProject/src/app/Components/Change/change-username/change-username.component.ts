import { Component } from '@angular/core';
import { AccountService } from '../../../Service/account.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-change-username',
  templateUrl: './change-username.component.html',
  styleUrls: ['./change-username.component.css']
})
export class ChangeUsernameComponent {
  accountId: number=0;
  newUsername: string = '';

  constructor(private service: AccountService) { }

  changeUsername() {
    const accountId = sessionStorage.getItem('accountId');
    if (!accountId) {
      console.log('No accountId found in session storage');
      console.log(accountId);
      return;
    }
    this.service.changeUsername(parseInt(accountId), this.newUsername)
      .subscribe(
        () => alert('UserName updated successfully'),
        (error: any) => alert('Error updating email: ' + error.message)
      );
  }
}
