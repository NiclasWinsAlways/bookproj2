import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Components/Login/login/login.component';
import { RegisterComponent } from './Components/Register/register/register.component';
import { ChangeUsernameComponent } from './Components/Change/change-username/change-username.component';
import { ChangePasswordComponent } from './Components/Change/change-password/change-password.component';
import { ChangeEmailComponent } from './Components/Change/change-email/change-email.component';
import { BookComponent } from './Components/Book/book/book.component';
import { ProfileComponent } from './Components/profile/profile.component';
import { AdminDashboardComponent } from './Components/Admin/admin-dashboard/admin-dashboard.component';
import { AddBookComponentComponent } from './Components/Admin/add-book-component/add-book-component.component';
import { BookDetailsComponent } from './Components/Details/bookdetails/bookdetails.component'; // Ensure this path is correct
import { AdminGuard } from './Service/admin-guard.service';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'change-username', component: ChangeUsernameComponent },
  { path: 'change-password', component: ChangePasswordComponent },
  { path: 'change-email', component: ChangeEmailComponent },
  { path: 'library', component: BookComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'book-details/:id', component: BookDetailsComponent },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [AdminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'manage-books', component: BookComponent }, // Admin sub-route to manage books
      { path: 'manage-users', component: ProfileComponent } // Admin sub-route to manage users
    ]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
