import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
interface Player {
  id: number;
  first_name: string;
  last_name: string;
  position: string;
  height_feet: number | null;
  height_inches: number | null;
  weight_pounds: number | null;
  team: {
    id: number;
    full_name: string;
    abbreviation: string;
    conference: 'East' | 'West';
  };
  lastTenGames?: [
  ];
  stats?:[

  ]
}

@Injectable({
  providedIn: 'root',
})
export class JugadoresService {
  private _jugadores = signal<Player[]>([])
  private _loading = signal(false);
  private _error = signal<string | null>(null);
  baseUrl = 'https://api.balldontlie.io/v1/players';
  API_KEY = 'd684d11a-86d1-4704-899a-a169aa4e1ad4';
  jugadores = this._jugadores.asReadonly();
  loading = this._loading.asReadonly();
  error = this._error.asReadonly();
  constructor(private http: HttpClient){}

  getJugador(name:string){
    if(!name){
      this._jugadores.set([]);
      return;
    }
      
    this._loading.set(true);
    this._error.set(null)
    const headers = new HttpHeaders({
      Authorization: this.API_KEY,
    });
    this.http.get(`${this.baseUrl}/?search=${name}`, {headers:headers}).subscribe({
      next: (response:any) =>{
        this._jugadores.set(response.data);
      }, error: (err) =>{
        this._error.set('No se pudo obtener el jugador');
      }, complete: () =>{
        this._loading.set(false);
      }
    })
  }

}
