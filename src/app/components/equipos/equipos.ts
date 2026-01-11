import { Component, computed, effect, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { Equipos } from '../../services/equipos.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterModule } from "@angular/router";
import { FavoritosService } from '../../services/favoritos-service';

@Component({
  selector: 'app-equipos',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './equipos.html',
  styleUrl: './equipos.css',
})
export class EquiposComponent implements OnInit{
  private equiposService = inject(Equipos);
  private platformId = inject(PLATFORM_ID);
  private favoritosService = inject(FavoritosService);
  equipos = this.equiposService.equipos;
  loading = this.equiposService.loading;
  error = this.equiposService.error;
  search = signal('');
  favoritos = this.favoritosService.favoritos;
  private isBrowser = isPlatformBrowser(this.platformId);

  equiposFiltrados = computed(() =>{
    const term = this.search().toLowerCase();
    if(!term){
      return this.equipos().filter(e => e.division !== '');
    }
    return this.equipos().filter(e => e.full_name.toLocaleLowerCase().includes(term) && e.division !== '');
  })
  constructor() {
    
  }
  
  ngOnInit() {
    if (this.isBrowser) {
      this.equiposService.getEquipos();
    }
  }
  
  
  toggleToFavoritos(event:MouseEvent,team:any){
    event?.stopPropagation();
    this.favoritosService.toggle(team);
  }
  isFavorito(teamId: number) {
    return this.favoritosService.isFavorito(teamId);
  }
  
}
