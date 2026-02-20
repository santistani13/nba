import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { TEAMS_DATA } from 'src/mock/teamDetal.data';

@Injectable()
export class TeamsDetailService {
  constructor(
    private prisma: PrismaService
  ){}
    getTeams(){
      return this.prisma.team.findMany();
    }


    getTeamDetail(teamId){
        const team = TEAMS_DATA.find(t => t.id === teamId);
    
        if(!team){
          throw new NotFoundException('Equipo no encontrado');
        }
          return team;
      }
}
