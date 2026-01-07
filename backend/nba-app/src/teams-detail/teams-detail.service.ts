import { Injectable, NotFoundException } from '@nestjs/common';
import { TEAMS_DATA } from 'src/mock/teamDetal.data';

@Injectable()
export class TeamsDetailService {

    getTeamDetail(teamId){
        const team = TEAMS_DATA.find(t => t.id === teamId);
    
        if(!team){
          throw new NotFoundException('Equipo no encontrado');
        }
          return team;
      }
}
