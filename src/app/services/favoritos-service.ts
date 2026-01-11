import { isPlatformBrowser } from '@angular/common';
import { effect, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { ToastService } from './toast-service';

@Injectable({
  providedIn: 'root',
})
export class FavoritosService {
  private _favoritos = signal<any[]>([]);
  favoritos = this._favoritos.asReadonly();

  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private toast = inject(ToastService);
  constructor() {
    if (this.isBrowser) {
      const stored = localStorage.getItem('favoriteTeams');
      if (stored) {
        this._favoritos.set(JSON.parse(stored));
      }

      effect(() => {
        localStorage.setItem(
          'favoriteTeams',
          JSON.stringify(this._favoritos())
        );
      });
    }
  }

  toggle(team: any) {
    const exists = this._favoritos().some(f => f.id === team.id);

    this._favoritos.update(favs =>
      exists
        ? favs.filter(f => f.id !== team.id)
        : [...favs, team]
    );
    if (exists) {
      this.toast.warning(`Quitaste a ${team.full_name} de favoritos`, {
        icon: '⭐',
      });
    } else {
      this.toast.success(`${team.full_name} agregado a favoritos`, {
        icon: '⭐',
      });
    }
  }

  isFavorito(teamId: number) {
    return this._favoritos().some(f => f.id === teamId);
  }
}
