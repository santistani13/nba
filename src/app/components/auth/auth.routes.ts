import { Routes } from '@angular/router';
import { Login } from './login/login';

export const authRoutes: Routes = [
    {
      path: 'login',
      loadComponent: () =>
        import('./login/login').then(m => m.Login),
    },
  ];
