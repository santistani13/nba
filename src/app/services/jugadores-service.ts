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
  baseUrl = 'http://localhost:3000/jugadores';
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
    
    this.http.get(`${this.baseUrl}`, {params: {name}}).subscribe({
      next: (response:any) =>{
        console.log(response)
        this._jugadores.set(response);
      }, error: (err) =>{
        this._error.set('No se pudo obtener el jugador');
      }, complete: () =>{
        this._loading.set(false);
      }
    })
  }

}
