import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
 interface Team {
  id: number;
  abbreviation: string;
  city: string;
  conference: 'East' | 'West';
  division: string;
  full_name: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class Equipos {
  private _equipos = signal<Team[]>([]);
  private _loading = signal(false);
  private _loaded = signal(false);
  private readonly API_URL = 'https://api.balldontlie.io/v1/teams';
  private _error = signal<string | null>(null);

  equipos = this._equipos.asReadonly();
  loading = this._loading.asReadonly();
  loaded = this._loaded.asReadonly();
  error = this._error.asReadonly();
  API_KEY = 'd684d11a-86d1-4704-899a-a169aa4e1ad4';
  constructor(private http:HttpClient){
  }

  getEquipos(){
    if (this._loaded()) return;
    this._loaded.set(true);
    this._loading.set(true);
    this._error.set(null);
    const headers = new HttpHeaders({
      Authorization: this.API_KEY,
    });
    this.http.get(this.API_URL, {headers}).subscribe({
      next: (response:any) =>{
        this._equipos.set(response.data);
      }, error: err => {
          this._error.set('Error cargando los equipos');
      }, complete: () => {
        this._loading.set(false);
      }
    })
  }
}
