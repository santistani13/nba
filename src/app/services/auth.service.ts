import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
interface LoginResponse {
    access_token: string;
  }
@Injectable({
  providedIn: 'root',
})

export class AuthService {
    private apiUrl = 'http://localhost:3000/auth';
    private _token = signal<string | null>(
      localStorage.getItem('token')
    );
    error = signal<string | null>(null)
    token = this._token.asReadonly();
    _error = this.error.asReadonly();
    isAuthenticated = computed(() => !!this._token());
  
    constructor(private http: HttpClient) {}
  
    login(email: string, password: string) {
      return this.http
        .post<LoginResponse>(`${this.apiUrl}/login`, { email, password })
        .subscribe({
          next: (res) => {
            localStorage.setItem('token', res.access_token);
            this._token.set(res.access_token);
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
}
