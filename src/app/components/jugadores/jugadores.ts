import { Component, computed, effect, inject } from '@angular/core';
import { JugadoresService } from '../../services/jugadores-service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-jugadores',
  imports: [CommonModule, RouterLink],
  templateUrl: './jugadores.html',
  styleUrl: './jugadores.css',
})
export class Jugadores {
  private jugadoresService = inject(JugadoresService);
  search = this.jugadoresService.search;
  jugadores = this.jugadoresService.jugadores;
  loading = this.jugadoresService.loading;
  error = this.jugadoresService.error;
  private timerSubscription?: Subscription;
  constructor(){
    effect(() =>{
      const value = this.search().trim();
      this.timerSubscription?.unsubscribe();
      if(!value || value.length < 3)return;
      this.timerSubscription = timer(500).subscribe(() =>{
        this.jugadoresService.getJugador(value);
      })
    })
  }

  jugadoresFiltrados = computed(() =>{
    const search = this.search().toLocaleLowerCase();
    if(!search)return this.jugadores();

    return this.jugadores().filter(j => `${j.first_name} ${j.last_name}`.toLocaleLowerCase().includes(search))
  });

  onSearch(name:string){
    this.jugadoresService.setSearch(name);
  }
}
