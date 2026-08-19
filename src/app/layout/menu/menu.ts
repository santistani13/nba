import { Component, EventEmitter, inject, Input, Output, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-menu',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class MenuComponent {
  @Input() open: boolean = true;
  @Output() toggle = new EventEmitter<void>();
  private platformId = inject(PLATFORM_ID);

  // En mobile, al navegar a una sección se cierra el drawer automáticamente.
  // En desktop (riel/expandido) la navegación no debe colapsar el menú.
  onNavigate(): void {
    if (isPlatformBrowser(this.platformId) && window.innerWidth < 768 && this.open) {
      this.toggle.emit();
    }
  }

  // En mobile el sidebar es un drawer que aparece/desaparece por completo
  // (fixed + translate-x). En desktop (md+) sigue empujando el contenido
  // como antes: w-64 expandido o w-16 como riel de íconos.
  get rootClasses(): string {
    // Mobile: drawer fijo debajo del header (top-14), fuera del flujo.
    // Desktop: vuelve al flujo normal (static) y ocupa toda la altura de su fila.
    const base = 'bg-gray-900 text-white transition-all duration-300 fixed top-14 bottom-0 left-0 z-40 w-64 md:static md:top-auto md:bottom-auto md:h-full md:z-auto';
    const mobileTranslate = this.open ? 'translate-x-0' : '-translate-x-full';
    const desktopWidth = this.open ? 'md:w-64' : 'md:w-16';
    return `${base} ${mobileTranslate} md:translate-x-0 ${desktopWidth}`;
  }
}
