import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HomeService } from '../../services/home-service';
import { AuthService } from '../../services/auth.service';
import { RevealDirective } from '../../directives/reveal.directive';
import { ScrollScrub } from '../scroll-scrub/scroll-scrub';
import { teamLogoUrl } from '../../models/team-logos';

@Component({
  selector: 'app-inicio',
  imports: [CommonModule, RouterLink, RevealDirective, ScrollScrub],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio {
  private homeService = inject(HomeService);
  private authService = inject(AuthService);

  lideresPuntos = this.homeService.lideresPuntos;
  lideresAsistencias = this.homeService.lideresAsistencias;
  lideresRebotes = this.homeService.lideresRebotes;
  mejoresEquipos = this.homeService._bestTeams;
  equiposMasGanadores = this.homeService._equiposMasGanadores;
  loading = this.homeService.loading;
  error = this.homeService.error;

  teamLogo = teamLogoUrl;

  readonly heroImage =
    'https://commons.wikimedia.org/wiki/Special:FilePath/New-York_Knicks_in_the_Madison_Square_Garden_%286054203290%29.jpg?width=1920';

  // Cada foto se empareja 1 a 1 (por índice) con un <ng-template> en el
  // html, que trae contenido real de la app (líderes, equipos, etc.)
  readonly scrubPhotos = [
    { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/NBA_Game.jpg?width=1920' },
    { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kawhi_Leonard_Dunk_cropped.jpg?width=1920' },
    { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/LeBronJamesDunkingHeat.jpg?width=1920' },
    { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/AD_lakers.jpg?width=1920' },
    { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Basketball_net.jpg?width=1920' },
    { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Pierce_Takes_the_Trophy.jpg?width=1920' },
  ];

  readonly features = [
    {
      icon: '🏀',
      title: 'Jugadores',
      desc: 'Buscá cualquier jugador de la liga y mirá sus estadísticas y campeonatos.',
      link: '/jugadores',
    },
    {
      icon: '🛡️',
      title: 'Equipos',
      desc: 'Explorá las plantillas, la temporada actual y la historia de cada franquicia.',
      link: '/equipos',
    },
    {
      icon: '📊',
      title: 'Estadísticas',
      desc: 'Números y líderes de la liga actualizados.',
      link: '/estadisticas',
    },
    {
      icon: '⭐',
      title: 'Favoritos',
      desc: 'Guardá tus equipos favoritos para tenerlos siempre a mano.',
      link: '/favoritos',
    },
  ];

  constructor() {
    effect(() => {
      if (this.authService.isAuthenticated()) {
        this.homeService.getOverview();
      }
    });
  }
}
