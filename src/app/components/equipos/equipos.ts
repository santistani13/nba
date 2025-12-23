import { Component, computed, effect, inject, PLATFORM_ID, signal } from '@angular/core';
import { Equipos } from '../../services/equipos.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-equipos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './equipos.html',
  styleUrl: './equipos.css',
})
export class EquiposComponent{
  private equiposService = inject(Equipos);
  private platformId = inject(PLATFORM_ID);
  equipos = this.equiposService.equipos;
  loading = this.equiposService.loading;
  error = this.equiposService.error;
  search = signal('');
  equiposFiltrados = computed(() =>{
    const term = this.search().toLowerCase();
    if(!term){
      return this.equipos();
    }
    return this.equipos().filter(e => e.full_name.toLocaleLowerCase().includes(term));
  })
  constructor(){
    if (isPlatformBrowser(this.platformId)) {
      effect(() => {
        this.equiposService.getEquipos();
      });
    }
  }
}
