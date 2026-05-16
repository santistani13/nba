import { Component, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeService } from '../../services/home-service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-partidos-slider',
  imports: [CommonModule],
  templateUrl: './partidos-slider.html',
  styleUrl: './partidos-slider.css',
})
export class PartidosSlider {
  private homeService = inject(HomeService);
  private authService = inject(AuthService);

  today = new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });

  // duplicamos para que la animación marquee sea infinita y seamless
  gamesDisplay = computed(() => {
    const g = this.homeService.games();
    return g.length ? [...g, ...g] : [];
  });

  constructor() {
    effect(() => {
      if (this.authService.isAuthenticated()) {
        this.homeService.getGames();
      }
    });
  }
}