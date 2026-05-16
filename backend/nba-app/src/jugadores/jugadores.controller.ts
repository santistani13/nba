import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { JugadoresService } from './jugadores.service';

@Controller('jugadores')
export class JugadoresController {
  constructor(private readonly jugadoresService: JugadoresService) {}

  @Get()
  getJugadores(@Query('name') name: string) {
    return this.jugadoresService.getJugador(name);
  }

  @Get(':id')
  async getJugadorById(@Param('id') id: string) {
    const player = await this.jugadoresService.getJugadorById(Number(id));
    if (!player) throw new NotFoundException('Jugador no encontrado');
    return player;
  }
}