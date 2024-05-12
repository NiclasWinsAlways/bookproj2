import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Components/Login/login/login.component';
import { ChangeEmailComponent } from './Components/Change/change-email/change-email.component';
import { ChangeUsernameComponent } from './Components/Change/change-username/change-username.component';
import { ChangePasswordComponent } from './Components/Change/change-password/change-password.component';
import { RegisterComponent } from './Components/Register/register/register.component';
import { NavbarComponent } from './Components/Navbar/navbar/navbar.component';
import { BookComponent } from './Components/Book/book/book.component';
import { ProfileComponent } from './Components/profile/profile.component';

// Importing services
import { BookService } from './Service/book.service';
import { VolumeService } from './Service/volume.service';
import { BookListComponentComponent } from './Components/Admin/book-list-component/book-list-component.component';
import { AddBookComponentComponent } from './Components/Admin/add-book-component/add-book-component.component';
import { AdminDashboardComponent } from './Components/Admin/admin-dashboard/admin-dashboard.component';
import { BookDetailsComponent } from './Components/Details/bookdetails/bookdetails.component';
import { ManageBooksComponent } from './Components/Admin/managebooks/managebooks.component';
import { ManageUsersComponent } from './Components/Admin/manageusers/manageusers.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ChangeEmailComponent,
    ChangeUsernameComponent,
    ChangePasswordComponent,
    RegisterComponent,
    NavbarComponent,
    BookComponent,
    ProfileComponent,
    BookListComponentComponent,
    AddBookComponentComponent,
    AdminDashboardComponent,
    BookDetailsComponent,
    ManageBooksComponent,
    ManageUsersComponent  // Make sure this is included
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule
  ],
  providers: [BookService, VolumeService], // Adding services here
  bootstrap: [AppComponent]
})
export class AppModule { }
