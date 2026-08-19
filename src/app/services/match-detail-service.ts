import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MatchDetailService {
  private baseUrl = `${environment.apiUrl}/matchresults`;
  _matches = signal<any[]>([]);
  _loading = signal(false);
  matches = this._matches.asReadonly();
  loading = this._loading.asReadonly();
    constructor(private http: HttpClient){}
  getMatches(){
    this._loading.set(true);
    return this.http.get(`${this.baseUrl}`).subscribe({
      next: (data:any) =>{
        this._matches.set(data);
      }, error: err =>{
        console.error('[MatchDetailService] /matchresults falló:', err);
        this._loading.set(false);
      }, complete: () =>{
        this._loading.set(false);
      }
    })
  }
  
}
