import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs';
import { LoadingService } from '../services/loading-service';

/**
 * Prende/apaga el loader global cada vez que hay una request HTTP en curso,
 * sin necesidad de un signal de loading manual por servicio.
 */
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  loadingService.start();

  return next(req).pipe(
    finalize(() => loadingService.stop()),
  );
};
