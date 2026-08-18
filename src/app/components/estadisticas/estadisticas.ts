import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HomeService } from '../../services/home-service';
import { AuthService } from '../../services/auth.service';
import { RevealDirective } from '../../directives/reveal.directive';
import { teamLogoUrl } from '../../models/team-logos';

@Component({
  selector: 'app-estadisticas',
  imports: [CommonModule, RouterLink, RevealDirective],
  templateUrl: './estadisticas.html',
  styleUrl: './estadisticas.css',
})
export class Estadisticas {
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
    'https://commons.wikimedia.org/wiki/Special:FilePath/Basketball_net.jpg?width=1920';

  readonly leaderCategories = [
    { key: 'ppg', title: 'Puntos por partido', icon: '🏀', unit: 'PPG' },
    { key: 'apg', title: 'Asistencias por partido', icon: '🤝', unit: 'APG' },
    { key: 'rpg', title: 'Rebotes por partido', icon: '🧱', unit: 'RPG' },
  ] as const;

  leadersFor(key: 'ppg' | 'apg' | 'rpg') {
    if (key === 'ppg') return this.lideresPuntos();
    if (key === 'apg') return this.lideresAsistencias();
    return this.lideresRebotes();
  }

  maxValue(key: 'ppg' | 'apg' | 'rpg') {
    const list = this.leadersFor(key);
    return list.length ? list[0].value : 1;
  }

  get topScorer() {
    return this.lideresPuntos()[0] ?? null;
  }

  get topPlaymaker() {
    return this.lideresAsistencias()[0] ?? null;
  }

  get topRebounder() {
    return this.lideresRebotes()[0] ?? null;
  }

  get topTeam() {
    return this.mejoresEquipos()[0] ?? null;
  }

  constructor() {
    effect(() => {
      if (this.authService.isAuthenticated()) {
        this.homeService.getOverview();
      }
    });
  }
}
