import { Component, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../directives/reveal.directive';

interface AiDemoTurn {
  role: 'user' | 'assistant';
  text: string;
}

interface AiDemo {
  eyebrow: string;
  title: string;
  icon: string;
  image: string;
  turns: AiDemoTurn[];
}

interface StoryBand {
  eyebrow: string;
  title: string;
  icon: string;
  desc: string;
  image: string;
  link: string;
  linkLabel: string;
}

@Component({
  selector: 'app-inicio',
  imports: [CommonModule, RouterLink, RevealDirective],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio {
  private platformId = inject(PLATFORM_ID);

  readonly heroImage =
    'https://commons.wikimedia.org/wiki/Special:FilePath/LeBronJamesDunkingHeat.jpg?width=1920';

  readonly statsStrip = [
    { icon: '🏀', value: '30', label: 'Equipos NBA' },
    { icon: '👤', value: '60+', label: 'Jugadores con stats' },
    { icon: '🤖', value: 'IA en vivo', label: 'Lee tu base de datos real' },
    { icon: '⚡', value: 'Groq', label: 'Respuestas en segundos' },
  ];

  // Conversación de ejemplo: muestra cómo la IA responde con datos reales
  // de la base (no inventa nada). Una sola banda de chat, no más.
  readonly aiDemo: AiDemo = {
    eyebrow: 'Preguntá lo que quieras',
    title: 'Stats de cualquier jugador, al toque',
    icon: '🏀',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kawhi_Leonard_Dunk_cropped.jpg?width=1920',
    turns: [
      { role: 'user', text: '¿Cuántos puntos promedia LeBron James?' },
      {
        role: 'assistant',
        text: 'LeBron James promedia 25.2 puntos por partido con los Lakers, según los datos oficiales de la base 🏀',
      },
    ],
  };

  // Otras dos bandas, sin bubbles de chat: features distintos de la app.
  readonly storyBands: StoryBand[] = [
    {
      eyebrow: 'Nunca los pierdas de vista',
      title: 'Guardá tus equipos favoritos',
      icon: '⭐',
      desc: 'Marcá tus franquicias favoritas y accedé a ellas al instante desde cualquier parte de la app, sin tener que buscarlas cada vez.',
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/NBA_Game.jpg?width=1920',
      link: '/favoritos',
      linkLabel: 'Ir a favoritos',
    },
    {
      eyebrow: 'Las 30 franquicias',
      title: 'Toda la liga, plantilla por plantilla',
      icon: '🛡️',
      desc: 'Desde los Celtics hasta los Lakers: historia, campeonatos y el roster completo de cada equipo de la NBA en un solo lugar.',
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/AD_lakers.jpg?width=1920',
      link: '/equipos',
      linkLabel: 'Explorar equipos',
    },
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

  openAiChat() {
    if (!isPlatformBrowser(this.platformId)) return;
    document.getElementById('ai-chat-launcher')?.click();
  }
}
