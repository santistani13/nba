import { Component, effect, inject } from '@angular/core';
import { HomeService } from '../../services/home-service';

@Component({
  selector: 'app-inicio',
  imports: [],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio{
 private homeService = inject(HomeService);
 lideresPuntos = this.homeService.lideresPuntos;
 lideresAsistencias = this.homeService.lideresAsistencias;
 lideresRebotes = this.homeService.lideresRebotes;
 mejoresEquipos = this.homeService._bestTeams;
 equiposMasGanadores = this.homeService._equiposMasGanadores;
 loading = this.homeService.loading;
 error = this.homeService.error;

 constructor(){
    effect(() => {
      this.homeService.getOverview();
    });
 }
}
