import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

const CHAMPIONSHIPS: Record<string, { total: number; years: number[] }> = {
  'LeBron James':           { total: 4, years: [2012, 2013, 2016, 2020] },
  'Stephen Curry':          { total: 4, years: [2015, 2017, 2018, 2022] },
  'Kevin Durant':           { total: 2, years: [2017, 2018] },
  'Giannis Antetokounmpo':  { total: 1, years: [2021] },
  'Nikola Jokic':           { total: 1, years: [2023] },
  'Jayson Tatum':           { total: 1, years: [2024] },
  'Jaylen Brown':           { total: 1, years: [2024] },
  'Klay Thompson':          { total: 4, years: [2015, 2017, 2018, 2022] },
  'Draymond Green':         { total: 4, years: [2015, 2017, 2018, 2022] },
};

@Injectable()
export class JugadoresService {
  constructor(private prismaService: PrismaService) {}

  getJugador(name: string) {
    return this.prismaService.player.findMany({
      where: {
        OR: [
          { first_name: { contains: name, mode: 'insensitive' } },
          { last_name: { contains: name, mode: 'insensitive' } },
        ],
      },
      include: { team: true },
    });
  }

  async getJugadorById(id: number) {
    const player = await this.prismaService.player.findUnique({
      where: { id },
      include: { stats: true, team: true },
    });

    if (!player) return null;

    const fullName = `${player.first_name} ${player.last_name}`;
    const championships = CHAMPIONSHIPS[fullName] ?? { total: 0, years: [] };

    return { ...player, championships };
  }
}