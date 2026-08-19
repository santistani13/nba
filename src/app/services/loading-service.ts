import { Injectable, computed, signal } from '@angular/core';

/**
 * Trackea cuántas requests HTTP hay en vuelo en toda la app.
 * El interceptor `loadingInterceptor` suma/resta acá en cada request,
 * así que no hace falta manejar loaders a mano en cada servicio: alcanza
 * con leer `loading()` en cualquier lugar (por ejemplo, la barra de
 * progreso global del layout).
 */
@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private _pending = signal(0);
  pending = this._pending.asReadonly();
  loading = computed(() => this._pending() > 0);

  start(): void {
    this._pending.update((n) => n + 1);
  }

  stop(): void {
    this._pending.update((n) => Math.max(0, n - 1));
  }
}
