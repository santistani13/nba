import { Module } from '@nestjs/common';
import { JugadoresService } from './jugadores.service';
import { JugadoresController } from './jugadores.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [JugadoresController],
  providers: [JugadoresService, PrismaService],
})
export class JugadoresModule {}
