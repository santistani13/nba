import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';

export interface Player {
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
    city: string;
    division: string;
  };
}

export interface PlayerDetail extends Player {
  stats: { ppg: number; rpg: number; apg: number } | null;
  championships: { total: number; years: number[] };
}

@Injectable({
  providedIn: 'root',
})
export class JugadoresService {
  private _jugadores = signal<Player[]>([]);
  private _jugador = signal<PlayerDetail | null>(null);
  private _loading = signal(false);
  private _loadingDetail = signal(false);
  private _error = signal<string | null>(null);
  private _errorDetail = signal<string | null>(null);
  private _search = signal('');

  baseUrl = 'http://localhost:3000/jugadores';
  jugadores = this._jugadores.asReadonly();
  jugador = this._jugador.asReadonly();
  loading = this._loading.asReadonly();
  loadingDetail = this._loadingDetail.asReadonly();
  error = this._error.asReadonly();
  errorDetail = this._errorDetail.asReadonly();
  search = this._search.asReadonly();

  constructor(private http: HttpClient) {}

  setSearch(value: string) {
    this._search.set(value);
  }

  getJugador(name: string) {
    if (!name) {
      this._jugadores.set([]);
      return;
    }
    this._loading.set(true);
    this._error.set(null);
    this.http.get<Player[]>(`${this.baseUrl}`, { params: { name } }).subscribe({
      next: (response) => this._jugadores.set(response),
      error: () => this._error.set('No se pudo obtener el jugador'),
      complete: () => this._loading.set(false),
    });
  }

  getJugadorById(id: number) {
    this._loadingDetail.set(true);
    this._errorDetail.set(null);
    this._jugador.set(null);
    this.http.get<PlayerDetail>(`${this.baseUrl}/${id}`).subscribe({
      next: (response) => this._jugador.set(response),
      error: () => this._errorDetail.set('No se pudo cargar el jugador'),
      complete: () => this._loadingDetail.set(false),
    });
  }
}