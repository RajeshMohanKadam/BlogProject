import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  login(data: any) {
    return this.http.post(`${this.baseUrl}/auth/login`, data);
  }

  register(data: any) {
    return this.http.post(`${this.baseUrl}/auth/register`, data);
  }

  saveToken(token: string) {
    localStorage.setItem('auth_token', token)
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token')
  }

  // Check login status
  isLoggedIn(): boolean {
    return !!localStorage.getItem('auth_token');
  }

}
