import { Component, effect, ElementRef, inject, OnInit, PLATFORM_ID, signal, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { MenuComponent } from '../menu/menu';
import { FooterComponent } from '../footer/footer';
import { ToastComponent } from "../../components/toast-component/toast-component";
import { ToastService } from '../../services/toast-service';
import { AuthService } from '../../services/auth.service';
import { AiChat } from "../../components/ai-chat/ai-chat";
import { PartidosSlider } from '../../components/partidos-slider/partidos-slider';
import { LoadingService } from '../../services/loading-service';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, MenuComponent, FooterComponent, ToastComponent, AiChat, PartidosSlider],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayoutComponent implements OnInit {
  // Arranca expandido en desktop, cerrado (drawer oculto) en mobile.
  private platformId = inject(PLATFORM_ID);
  menuOpen = signal<boolean>(
    isPlatformBrowser(this.platformId) ? window.innerWidth >= 768 : true,
  );
  private authService = inject(AuthService);
  private router = inject(Router)
  userEmail = this.authService._userEmail;

  // Loader global: se prende solo cada vez que hay una request HTTP en curso
  // (ver loading.interceptor.ts), sin depender de que cada página maneje su
  // propio signal a mano.
  private loadingService = inject(LoadingService);
  apiLoading = this.loadingService.loading;

  // El header, el menú y el slider quedan fijos; el único contenedor que
  // scrollea es #scrollArea. Como ya no scrollea el window, reseteamos
  // manualmente su scrollTop al navegar (equivalente al viejo
  // scrollPositionRestoration pero para un contenedor interno).
  @ViewChild('scrollArea') private scrollArea?: ElementRef<HTMLDivElement>;

  constructor(){
    effect(() =>{
      if(!this.authService.isAuthenticated()){
        this.router.navigate(['/auth/login']);
      }
    })
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => {
        if (this.scrollArea) {
          this.scrollArea.nativeElement.scrollTop = 0;
        }
      });
  }
  ngOnInit(): void {
    this.authService.loadUser();
  }
  toggleMenu() {
    this.menuOpen.update(v => !v);
  }
  logout(){
    this.authService.logout();
  }

}
