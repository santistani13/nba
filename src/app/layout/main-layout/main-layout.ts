import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from '../menu/menu';
import { FooterComponent } from '../footer/footer';
import { ToastComponent } from "../../components/toast-component/toast-component";
import { ToastService } from '../../services/toast-service';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, MenuComponent, FooterComponent, ToastComponent],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayoutComponent {
  menuOpen = signal<boolean>(true);
  toggleMenu() {
    this.menuOpen.update(v => !v);
  }

}
