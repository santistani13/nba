import { Component, computed, effect, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { Equipos } from '../../services/equipos.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterModule } from "@angular/router";

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
  equipos = this.equiposService.equipos;
  loading = this.equiposService.loading;
  error = this.equiposService.error;
  search = signal('');
  favoritos = signal<number[]>([]);
  private isBrowser = isPlatformBrowser(this.platformId);

  equiposFiltrados = computed(() =>{
    const term = this.search().toLowerCase();
    if(!term){
      return this.equipos().filter(e => e.division !== '');
    }
    return this.equipos().filter(e => e.full_name.toLocaleLowerCase().includes(term) && e.division !== '');
  })
  constructor() {
    if (this.isBrowser) {
      effect(() => {
        localStorage.setItem(
          'favoriteTeams',
          JSON.stringify(this.favoritos())
        );
      });
    }
  }
  
  ngOnInit() {
    if (this.isBrowser) {
      this.equiposService.getEquipos();
  
      const stored = localStorage.getItem('favoriteTeams');
      if (stored) {
        this.favoritos.set(JSON.parse(stored));
      }
    }
  }
  
  
  toggleToFavoritos(event:MouseEvent,team:any){
    event?.stopPropagation();
    this.favoritos.update((favs) =>{
      return favs.includes(team.id)
      ? favs.filter(id => id !== team.id)
      : [...favs, team.id]; 
    })
  }
  isFavorito(teamId: number) {
    return this.favoritos().includes(teamId);
  }
  
}
