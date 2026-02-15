import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { tap } from 'rxjs';
interface LoginResponse {
    access_token: string;
  }
@Injectable({
  providedIn: 'root',
})

export class AuthService {
    private apiUrl = 'http://localhost:3000/auth';
    private _token = signal<string | null>(null);
    error = signal<string | null>(null)
    userEmail = signal<string | null>(null)
    token = this._token.asReadonly();
    _error = this.error.asReadonly();
    isAuthenticated = computed(() => !!this._token());
    _userEmail = this.userEmail.asReadonly();
    private platformId = inject(PLATFORM_ID);
    constructor(private http: HttpClient) {
      if (isPlatformBrowser(this.platformId)) {
        const token = localStorage.getItem('token');
        this._token.set(token);
      }
    }
  
    login(email: string, password: string) {
      return this.http
        .post<LoginResponse>(`${this.apiUrl}/login`, { email, password })
        .subscribe({
          next: (res) => {
            this.handleAuth(res.access_token)
          }, error: (err:string) => {
            this.error.set(err);
          }, complete: () =>{

          }
        });
    }
  
    logout() {
      localStorage.removeItem('token');
      this._token.set(null);
    }
    register(email: string, password: string) {
      return this.http.post<{ message: string }>(
        `${this.apiUrl}/register`,
        { email, password }
      );
    }
    
     handleAuth(token: string) {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('token', token);
        this._token.set(token);
      }
    }
     loadUser() {
      const token = localStorage.getItem('token');
      if (!token) return;
    
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.userEmail.set(payload.email);
    }
}
