import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';  // Import HttpHeaders
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const httpOptions = {  // Define httpOptions to include JSON content type headers
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = environment.apiUrl; // Should be 'https://localhost:7236/api/'

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    const url = `${this.apiUrl}Account/login`; // Note: Removed the Accounts/ from apiUrl
    const body = { username: username, password: password }; // Ensure property names match those expected by the API
    return this.http.post<any>(url, body, httpOptions);
  }
}



