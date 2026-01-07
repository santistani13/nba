import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full',
  },
    {
        path: '',
        component: MainLayoutComponent,
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
