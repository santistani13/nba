import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

// Minijuego de tiros al aro: arrastrás la pelota hacia atrás (estilo
// resortera) y soltás para tirar. Física simple (gravedad + rebote en
// el tablero) hecha a mano con Canvas 2D, sin librerías externas.
@Component({
  selector: 'app-basketball-game',
  standalone: true,
  templateUrl: './basketball-game.html',
  styleUrl: './basketball-game.css',
})
export class BasketballGame implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') private canvasRef!: ElementRef<HTMLCanvasElement>;

  private platformId = inject(PLATFORM_ID);
  private ctx!: CanvasRenderingContext2D;

  private width = 600;
  private height = 400;
  private readonly gravity = 0.34;
  private readonly radius = 16;
  private groundY = 0;

  private ball: Ball = { x: 0, y: 0, vx: 0, vy: 0 };
  private ballStartX = 0;
  private ballStartY = 0;

  private hoop = { rimY: 0, rimLeft: 0, rimRight: 0, rimCenterX: 0, backboardX: 0 };

  private dragging = false;
  private dragPos = { x: 0, y: 0 };
  private flying = false;
  private scoredThisShot = false;

  private rafId = 0;
  private resetTimer?: ReturnType<typeof setTimeout>;

  score = signal(0);
  attempts = signal(0);
  message = signal('Arrastrá la pelota hacia atrás y soltá para tirar 🏀');

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.resize();
    this.setupHoop();
    this.setupBall();

    // mousemove va en window (no en el canvas): si el arrastre sale del
    // canvas -algo muy fácil en un canvas chico- había que seguir
    // registrando el movimiento, si no la potencia quedaba tope baja.
    canvas.addEventListener('mousedown', this.onPointerDown);
    window.addEventListener('mousemove', this.onPointerMove);
    window.addEventListener('mouseup', this.onPointerUp);
    canvas.addEventListener('touchstart', this.onPointerDown, { passive: false });
    canvas.addEventListener('touchmove', this.onPointerMove, { passive: false });
    window.addEventListener('touchend', this.onPointerUp);

    this.loop();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.rafId);
    if (this.resetTimer) clearTimeout(this.resetTimer);
    if (!isPlatformBrowser(this.platformId)) return;

    window.removeEventListener('mousemove', this.onPointerMove);
    window.removeEventListener('mouseup', this.onPointerUp);
    window.removeEventListener('touchend', this.onPointerUp);
    const canvas = this.canvasRef?.nativeElement;
    canvas?.removeEventListener('mousedown', this.onPointerDown);
    canvas?.removeEventListener('touchstart', this.onPointerDown);
    canvas?.removeEventListener('touchmove', this.onPointerMove);
  }

  @HostListener('window:resize')
  onWindowResize() {
    if (!isPlatformBrowser(this.platformId) || !this.canvasRef) return;
    this.resize();
    this.setupHoop();
    if (!this.flying) this.setupBall();
  }

  private resize() {
    const canvas = this.canvasRef.nativeElement;
    const parentWidth = canvas.parentElement?.clientWidth ?? 600;
    this.width = Math.min(640, Math.max(300, parentWidth));
    this.height = Math.round(this.width * 0.62);
    canvas.width = this.width;
    canvas.height = this.height;
    this.groundY = this.height - 20;
  }

  private setupBall() {
    this.ballStartX = this.width * 0.26;
    this.ballStartY = this.groundY - this.radius;
    this.ball = { x: this.ballStartX, y: this.ballStartY, vx: 0, vy: 0 };
  }

  private setupHoop() {
    this.hoop.rimCenterX = this.width * 0.76;
    this.hoop.rimY = this.height * 0.26;
    this.hoop.rimLeft = this.hoop.rimCenterX - 32;
    this.hoop.rimRight = this.hoop.rimCenterX + 32;
    this.hoop.backboardX = this.hoop.rimCenterX + 40;
  }

  private getPointerPos(e: MouseEvent | TouchEvent) {
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const point =
      'touches' in e ? e.touches[0] ?? (e as TouchEvent).changedTouches[0] : (e as MouseEvent);
    return {
      x: (point.clientX - rect.left) * (this.width / rect.width),
      y: (point.clientY - rect.top) * (this.height / rect.height),
    };
  }

  private onPointerDown = (e: MouseEvent | TouchEvent) => {
    if (this.flying) return;
    const pos = this.getPointerPos(e);
    const dx = pos.x - this.ball.x;
    const dy = pos.y - this.ball.y;
    if (Math.sqrt(dx * dx + dy * dy) < this.radius * 3) {
      this.dragging = true;
      this.dragPos = pos;
      e.preventDefault();
    }
  };

  private onPointerMove = (e: MouseEvent | TouchEvent) => {
    if (!this.dragging) return;
    e.preventDefault();
    this.dragPos = this.getPointerPos(e);
  };

  private onPointerUp = () => {
    if (!this.dragging) return;
    this.dragging = false;

    const dx = this.ball.x - this.dragPos.x;
    const dy = this.ball.y - this.dragPos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 8) return; // no fue un arrastre real, cancelar

    // Escala en raíz cuadrada en vez de lineal: un arrastre corto/medio
    // (lo más común) ya da un impulso decente, sin que un arrastre grande
    // se vaya totalmente de rosca.
    const power = Math.sqrt(Math.min(dist, 200)) * 2.15;
    const angle = Math.atan2(dy, dx);
    this.ball.vx = Math.cos(angle) * power;
    this.ball.vy = Math.sin(angle) * power;

    this.flying = true;
    this.scoredThisShot = false;
    this.message.set('');
  };

  private loop = () => {
    this.update();
    this.draw();
    this.rafId = requestAnimationFrame(this.loop);
  };

  private update() {
    if (!this.flying) return;

    this.ball.vy += this.gravity;
    this.ball.x += this.ball.vx;
    this.ball.y += this.ball.vy;

    // rebote contra el tablero
    if (
      this.ball.vx > 0 &&
      this.ball.x + this.radius >= this.hoop.backboardX &&
      this.ball.y > this.hoop.rimY - 60 &&
      this.ball.y < this.hoop.rimY + 60
    ) {
      this.ball.x = this.hoop.backboardX - this.radius;
      this.ball.vx *= -0.5;
    }

    // encestó
    if (
      !this.scoredThisShot &&
      this.ball.vy > 0 &&
      this.ball.y >= this.hoop.rimY &&
      this.ball.y <= this.hoop.rimY + 10 &&
      this.ball.x > this.hoop.rimLeft + 6 &&
      this.ball.x < this.hoop.rimRight - 6
    ) {
      this.scoredThisShot = true;
      this.score.update((s) => s + 1);
      this.message.set('¡Encestaste! 🏀🔥');
    }

    // terminó el tiro: tocó el piso o se fue de la cancha
    if (this.ball.y + this.radius >= this.groundY || this.ball.x < -50 || this.ball.x > this.width + 50) {
      this.flying = false;
      this.attempts.update((a) => a + 1);
      if (!this.scoredThisShot) this.message.set('Fallaste, probá de nuevo 🎯');
      this.resetTimer = setTimeout(() => this.setupBall(), 900);
    }
  }

  private draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // cancha
    ctx.fillStyle = '#0c1322';
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, this.groundY);
    ctx.lineTo(this.width, this.groundY);
    ctx.stroke();

    // tablero
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.fillRect(this.hoop.backboardX, this.hoop.rimY - 50, 8, 84);

    // aro
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(this.hoop.rimLeft, this.hoop.rimY);
    ctx.lineTo(this.hoop.rimRight, this.hoop.rimY);
    ctx.stroke();

    // red
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const x = this.hoop.rimLeft + (i * (this.hoop.rimRight - this.hoop.rimLeft)) / 4;
      ctx.beginPath();
      ctx.moveTo(x, this.hoop.rimY);
      ctx.lineTo(this.hoop.rimCenterX + (x - this.hoop.rimCenterX) * 0.35, this.hoop.rimY + 24);
      ctx.stroke();
    }

    // línea de puntería mientras arrastrás
    if (this.dragging) {
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(this.ball.x, this.ball.y);
      ctx.lineTo(this.dragPos.x, this.dragPos.y);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // pelota
    const grad = ctx.createRadialGradient(
      this.ball.x - 5,
      this.ball.y - 5,
      2,
      this.ball.x,
      this.ball.y,
      this.radius,
    );
    grad.addColorStop(0, '#ffc266');
    grad.addColorStop(1, '#c2570a');
    ctx.beginPath();
    ctx.arc(this.ball.x, this.ball.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.5)';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(this.ball.x - this.radius, this.ball.y);
    ctx.lineTo(this.ball.x + this.radius, this.ball.y);
    ctx.moveTo(this.ball.x, this.ball.y - this.radius);
    ctx.lineTo(this.ball.x, this.ball.y + this.radius);
    ctx.stroke();
  }
}
