import { Component, computed, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { JugadoresService } from '../../services/jugadores-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detalle-jugador',
  imports: [CommonModule, RouterLink],
  templateUrl: './detalle-jugador.html',
  styleUrl: './detalle-jugador.css',
})
export class DetalleJugador implements OnInit {
  private jugadoresService = inject(JugadoresService);
  private route = inject(ActivatedRoute);

  jugador = this.jugadoresService.jugador;
  loading = this.jugadoresService.loadingDetail;
  error = this.jugadoresService.errorDetail;

  photoUrl = computed(() => {
    const j = this.jugador();
    if (!j) return '';
    return `https://ui-avatars.com/api/?name=${j.first_name}+${j.last_name}&background=0f172a&color=f59e0b&size=300&bold=true&font-size=0.33`;
  });

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.jugadoresService.getJugadorById(Number(params.get('id')));
    });
  }

  barWidth(value: number | null | undefined, max: number): number {
    if (!value) return 0;
    return Math.min((value / max) * 100, 100);
  }

  onImgError(event: Event) {
    (event.target as HTMLImageElement).src =
      'https://ui-avatars.com/api/?name=NBA&background=0f172a&color=f59e0b&size=300&bold=true';
  }
}