import { Controller, Get, Query } from '@nestjs/common';
import { JugadoresService } from './jugadores.service';

@Controller('jugadores')
export class JugadoresController {
  constructor(private readonly jugadoresService: JugadoresService) {}

  @Get()
getJugadores(@Query('name') name: string) {
  return this.jugadoresService.getJugador(name);
}
}
