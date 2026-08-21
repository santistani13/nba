import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs';
import { LoadingService } from '../services/loading-service';

// Endpoints que ya tienen su propio indicador de carga en el UI (el chat
// muestra "escribiendo..."), así que no hace falta prender también la barra
// global de arriba para esas requests.
const EXCLUDED_URL_PATTERNS = ['/ai/chat'];

/**
 * Prende/apaga el loader global cada vez que hay una request HTTP en curso,
 * sin necesidad de un signal de loading manual por servicio.
 */
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  if (EXCLUDED_URL_PATTERNS.some(pattern => req.url.includes(pattern))) {
    return next(req);
  }

  const loadingService = inject(LoadingService);
  loadingService.start();

  return next(req).pipe(
    finalize(() => loadingService.stop()),
  );
};
