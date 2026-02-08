import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { bestTeamsSeason, mostChampionships, playersLeaders } from '../models/overviewModels';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private baseUrl = 'http://localhost:3000/home';
  _lideresPPP = signal<playersLeaders[]>([]);
  _lideresAPP = signal<playersLeaders[]>([]);
  _lideresRPP = signal<playersLeaders[]>([]);
  _bestTeams = signal<bestTeamsSeason[]>([]);
  _equiposMasGanadores = signal<mostChampionships[]>([]);
  _loading = signal(false);
  _error =signal<string | null>(null);
  lideresPuntos = this._lideresPPP.asReadonly();
  lideresAsistencias = this._lideresAPP.asReadonly();
  lideresRebotes = this._lideresRPP.asReadonly();
  error = this._error.asReadonly();
  loading = this._loading.asReadonly();
  constructor(private http: HttpClient){}

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
