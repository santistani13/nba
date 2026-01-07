import { Component, inject, OnInit, signal } from '@angular/core';
import { Equipos } from '../../services/equipos.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detalle-equipo',
  imports: [],
  templateUrl: './detalle-equipo.html',
  styleUrl: './detalle-equipo.css',
})
export class DetalleEquipo implements OnInit{
  private equiposService = inject(Equipos)
  private router = inject(ActivatedRoute)
  private _teamId = signal<number>(0);
  equipo = this.equiposService.equipo;
  loading = this.equiposService.loading;
  error = this.equiposService.error;
  defaultLogo = 'https://freepnglogo.com/image/495532';
  constructor(){

  }

  ngOnInit(): void {
    this.router.paramMap.subscribe(param => {
      const id = param.get('id');
      this._teamId.set(Number(id));
      this.equiposService.getEquipoById(Number(id));
    });
  }

  onImgError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = this.defaultLogo;
  }
}
