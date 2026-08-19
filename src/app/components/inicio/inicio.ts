import { Component, ElementRef, inject, OnDestroy, OnInit, PLATFORM_ID, signal, ViewChild } from '@angular/core';
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
export class Inicio implements OnInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);

  readonly heroImage =
    'https://commons.wikimedia.org/wiki/Special:FilePath/LeBronJamesDunkingHeat.jpg?width=1920';

  // Mix de videos de fondo del hero (mudo, sin sonido). Todos Mixkit, licencia
  // libre para uso comercial sin atribución. No existe metraje real de
  // partidos NBA con licencia libre por derechos de la liga; estos clips
  // varían el ángulo/escena (partido, clavada callejera, dribbling en
  // primer plano, toma aérea de cancha, pelota entrando al aro, equipo
  // festejando, clavada amateur al aire libre) para que el mix se sienta
  // como un highlight reel y no como el mismo video repetido. Cada clip se
  // deja terminar una vez (loop propio apagado) y recién ahí pasa al
  // siguiente, así no se repite 2-3 veces seguidas antes de rotar, pero
  // sigue en loop infinito por toda la lista.
  readonly heroVideos = [
    'https://assets.mixkit.co/videos/44471/44471-720.mp4', // partido, dos jugadores
    'https://assets.mixkit.co/videos/2285/2285-720.mp4',   // clavada callejera, tracking shot
    'https://assets.mixkit.co/videos/744/744-720.mp4',     // dribbling en primer plano
    'https://assets.mixkit.co/videos/1216/1216-720.mp4',   // toma aérea de la cancha
    'https://assets.mixkit.co/videos/13733/13733-720.mp4', // pelota entrando al aro, primer plano
    'https://assets.mixkit.co/videos/4588/4588-720.mp4',   // equipo festejando en ronda
    'https://assets.mixkit.co/videos/2273/2273-720.mp4',   // clavada amateur al aire libre
  ];

  @ViewChild('heroVideoA') private heroVideoARef?: ElementRef<HTMLVideoElement>;
  @ViewChild('heroVideoB') private heroVideoBRef?: ElementRef<HTMLVideoElement>;

  private heroIndex = 0;
  // Red de seguridad: si algún clip no dispara "ended" (falla de red, etc.)
  // igual rota a los pocos segundos para no quedar trabado en uno solo.
  private heroFallbackTimer?: ReturnType<typeof setTimeout>;
  private readonly heroFallbackMs = 16000;

  // Doble buffer para el crossfade: dos <video> superpuestos, uno visible
  // (activeSlot) y otro con el próximo clip cargado por detrás.
  activeSlot = signal<'a' | 'b'>('a');
  videoSrcA = signal(this.heroVideos[0]);
  videoSrcB = signal(this.heroVideos[1] ?? this.heroVideos[0]);

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId) || this.heroVideos.length < 2) return;
    this.armHeroFallback();
  }

  ngOnDestroy(): void {
    if (this.heroFallbackTimer) clearTimeout(this.heroFallbackTimer);
  }

  private armHeroFallback(): void {
    if (this.heroFallbackTimer) clearTimeout(this.heroFallbackTimer);
    this.heroFallbackTimer = setTimeout(() => this.rotateHeroVideo(), this.heroFallbackMs);
  }

  // Se llama cuando el <video> visible termina (evento "ended", sin loop).
  onHeroVideoEnded(slot: 'a' | 'b'): void {
    if (this.activeSlot() !== slot) return; // ignoramos el buffer oculto
    this.rotateHeroVideo();
  }

  private rotateHeroVideo(): void {
    this.heroIndex = (this.heroIndex + 1) % this.heroVideos.length;
    const nextSrc = this.heroVideos[this.heroIndex];
    const showingA = this.activeSlot() === 'a';
    const hiddenSlot = showingA ? 'b' : 'a';
    const hiddenRef = showingA ? this.heroVideoBRef : this.heroVideoARef;

    // Cargamos el próximo clip en el buffer oculto. Al estar bindeado con
    // [src] directo en el <video> (sin <source> hijo), cambiar el signal ya
    // actualiza la propiedad .src del elemento y dispara la recarga sola;
    // igual forzamos load()+play() para que sea consistente entre browsers.
    if (showingA) {
      this.videoSrcB.set(nextSrc);
    } else {
      this.videoSrcA.set(nextSrc);
    }

    if (!isPlatformBrowser(this.platformId)) return;

    queueMicrotask(() => {
      const el = hiddenRef?.nativeElement;
      if (!el) {
        this.activeSlot.set(hiddenSlot);
        this.armHeroFallback();
        return;
      }

      let switched = false;
      const doSwitch = () => {
        if (switched) return;
        switched = true;
        el.removeEventListener('loadeddata', doSwitch);
        clearTimeout(safety);
        this.activeSlot.set(hiddenSlot);
        this.armHeroFallback();
      };

      // Recién mostramos el buffer oculto cuando ya tiene un frame real
      // decodificado (loadeddata), así nunca se ve el poster (foto de
      // LeBron) de fondo en medio de la transición. Si por lo que sea
      // nunca dispara ese evento, hay un margen de seguridad para no
      // trabar el crossfade.
      el.addEventListener('loadeddata', doSwitch, { once: true });
      const safety = setTimeout(doSwitch, 2500);

      el.load();
      el.play().catch(() => {
        // autoplay bloqueado por el browser: no pasa nada, el timer de
        // seguridad igual va a completar el crossfade.
      });
    });
  }

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
