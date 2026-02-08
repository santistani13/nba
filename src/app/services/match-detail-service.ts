import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MatchDetailService {
  private baseUrl = 'http://localhost:3000/matchresults';
  _matches = signal<any[]>([]);
  matches = this._matches.asReadonly();
    constructor(private http: HttpClient){}
  getMatches(){
    return this.http.get(`${this.baseUrl}`).subscribe({
      next: (data:any) =>{
        this._matches.set(data);
      }, error: err =>{

      }, complete: () =>{

      }
    })
  }
  
}
