import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { bestTeamsSeason, mostChampionships, playersLeaders } from '../models/overviewModels';
import { environment } from '../../environments/environment';

export interface Game {
  id: number;
  home: { name: string; abbr: string };
  away: { name: string; abbr: string };
  time: string;
}

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private baseUrl = `${environment.apiUrl}/home`;
  _lideresPPP = signal<playersLeaders[]>([]);
  _lideresAPP = signal<playersLeaders[]>([]);
  _lideresRPP = signal<playersLeaders[]>([]);
  _bestTeams = signal<bestTeamsSeason[]>([]);
  _equiposMasGanadores = signal<mostChampionships[]>([]);
  _games = signal<Game[]>([]);
  _gamesLoading = signal(false);
  _loading = signal(false);
  _error = signal<string | null>(null);
  games = this._games.asReadonly();
  gamesLoading = this._gamesLoading.asReadonly();
  lideresPuntos = this._lideresPPP.asReadonly();
  lideresAsistencias = this._lideresAPP.asReadonly();
  lideresRebotes = this._lideresRPP.asReadonly();
  error = this._error.asReadonly();
  loading = this._loading.asReadonly();
  constructor(private http: HttpClient){}

  getGames() {
    this._gamesLoading.set(true);
    this.http.get<Game[]>(`${this.baseUrl}/games`).subscribe({
      next: (games) => this._games.set(games),
      error: (err) => {
        // antes fallaba en silencio y el slider quedaba vacío sin ningún
        // rastro; ahora al menos queda logueado para poder diagnosticarlo.
        console.error('[HomeService] /home/games falló:', err);
        this._gamesLoading.set(false);
      },
      complete: () => this._gamesLoading.set(false),
    });
  }

  getOverview(){
    this._error.set(null);
    this._loading.set(true)
    this.http.get(`${this.baseUrl}/overview`).subscribe({
      next: (response:any) =>{
        this._lideresPPP.set(response.leaders.ppg);
        this._lideresAPP.set(response.leaders.apg);        
        this._lideresRPP.set(response.leaders.rpg);    
        this._bestTeams.set(response.bestTeamsSeason);
        this._equiposMasGanadores.set(response.mostChampionships);            
      }, error: () =>{
        this._error.set('No se pudo obtener la informacion, intente nuevamente mas tarde');
      }, complete: () =>{
        this._loading.set(false);
      }
    });
  }
}
