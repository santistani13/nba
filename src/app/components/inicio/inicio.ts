import { Component, effect, inject } from '@angular/core';
import { HomeService } from '../../services/home-service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-inicio',
  imports: [],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio{
 private homeService = inject(HomeService);
 private authService = inject(AuthService)
 lideresPuntos = this.homeService.lideresPuntos;
 lideresAsistencias = this.homeService.lideresAsistencias;
 lideresRebotes = this.homeService.lideresRebotes;
 mejoresEquipos = this.homeService._bestTeams;
 equiposMasGanadores = this.homeService._equiposMasGanadores;
 loading = this.homeService.loading;
 error = this.homeService.error;

 constructor(){
    effect(() => {
      if(this.authService.isAuthenticated()){
        this.homeService.getOverview();
      }
    });
 }
}
