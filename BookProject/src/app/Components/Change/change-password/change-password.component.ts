import { Component } from '@angular/core';
import { AccountService } from '../../../Service/account.service';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  accountId: number=0;
  newPassword: string = '';

  constructor(private service: AccountService) { }

  changePassword() {
    const accountId = sessionStorage.getItem('accountId');
    if (!accountId) {
      console.log('No accountId found in session storage');
      console.log(accountId);
      return;
    }
    this.service.changePassword(parseInt(accountId), this.newPassword)
      .subscribe(
        () => alert('Password updated successfully'),
        (error: any) => alert('Error updating email: ' + error.message)
      );
  }
}
