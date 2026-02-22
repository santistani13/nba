import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class JugadoresService {


    constructor(private prismaService: PrismaService){

    }

    getJugador(name: string) {
        return this.prismaService.player.findMany({
          where: {
            OR: [
              {
                first_name: {
                  contains: name,
                  mode: 'insensitive',
                },
              },
              {
                last_name: {
                  contains: name,
                  mode: 'insensitive',
                },
              },
            ],
          },
    include: {
      team: true,
    },
        });
      }
}
