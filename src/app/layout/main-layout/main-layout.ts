import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from '../menu/menu';
import { FooterComponent } from '../footer/footer';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, MenuComponent, FooterComponent],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayoutComponent {
  menuOpen = signal<boolean>(true);

  toggleMenu() {
    this.menuOpen.update(v => !v);
  }

}
