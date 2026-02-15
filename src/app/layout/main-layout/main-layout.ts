import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MenuComponent } from '../menu/menu';
import { FooterComponent } from '../footer/footer';
import { ToastComponent } from "../../components/toast-component/toast-component";
import { ToastService } from '../../services/toast-service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, MenuComponent, FooterComponent, ToastComponent],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayoutComponent implements OnInit {
  menuOpen = signal<boolean>(true);
  private authService = inject(AuthService);
  private router = inject(Router)
  userEmail = this.authService._userEmail;
  constructor(){
    effect(() =>{
      if(!this.authService.isAuthenticated()){
        this.router.navigate(['/auth/login']);
      }
    })
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
