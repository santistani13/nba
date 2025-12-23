import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout';
import { EquiposComponent } from './components/equipos/equipos';

export const routes: Routes = [
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
            loadComponent: () => import('./components/equipos/equipos').then(m => m.EquiposComponent),
          },
          {
            path: 'jugadores',
            loadComponent: () => import('./components/jugadores/jugadores').then(m => m.Jugadores),
          },
          {
            path: 'estadisticas',
            loadComponent: () => import('./components/estadisticas/estadisticas').then(m => m.Estadisticas),
          }
        ]
      }
];
