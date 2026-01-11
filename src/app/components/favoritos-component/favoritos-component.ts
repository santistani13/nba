import { Component, inject } from '@angular/core';
import { FavoritosService } from '../../services/favoritos-service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-favoritos-component',
  imports: [RouterModule],
  templateUrl: './favoritos-component.html',
  styleUrl: './favoritos-component.css',
})
export class FavoritosComponent {
  private favoritosService = inject(FavoritosService);
  equiposFavoritos = this.favoritosService.favoritos;

  isFavorito(teamId: number) {
    return this.favoritosService.isFavorito(teamId);
  }
  toggleToFavoritos(event:MouseEvent,team:any){
    event?.stopPropagation();
    this.favoritosService.toggle(team);
  }
}
