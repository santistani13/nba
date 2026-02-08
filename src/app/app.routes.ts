import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout';
import { authRoutes } from './components/auth/auth.routes';
import { authGuard } from './guards/auth.guard';
import { Authlayout } from './components/auth/authlayout/authlayout';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    component: Authlayout,
    children: [
      ...authRoutes
    ]
  },
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [authGuard],
        children: [
          {
            path: 'inicio',
            loadComponent: () => import('./components/inicio/inicio').then(m => m.Inicio),
          },
          {
            path: 'equipos',
            children: [
              {
                path:'',
                loadComponent: () => import('./components/equipos/equipos').then(m => m.EquiposComponent),
              },
              {
                path:':id',
                loadComponent: () => import('./components/detalle-equipo/detalle-equipo').then(m => m.DetalleEquipo)
              }
            ]
          },
          {
            path: 'jugadores',
            loadComponent: () => import('./components/jugadores/jugadores').then(m => m.Jugadores),
          },
          {
            path: 'estadisticas',
            loadComponent: () => import('./components/estadisticas/estadisticas').then(m => m.Estadisticas),
          },
          {
            path: 'favoritos',
            loadComponent: () => import('./components/favoritos-component/favoritos-component').then(m => m.FavoritosComponent),
          }
        ]
      }
];
