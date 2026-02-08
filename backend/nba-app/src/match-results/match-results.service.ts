import { Injectable } from '@nestjs/common';
import { MatchResultDto } from 'src/interfaces/match-results.dto';
import { TEAMS_DATA } from 'src/mock/teamDetal.data';

@Injectable()
export class MatchResultsService {
    getMatchResults(): MatchResultDto[] {
        return Array.from({ length: 8 }).map((_, i) => {
          const homeTeam = TEAMS_DATA[i * 2];
          const awayTeam = TEAMS_DATA[i * 2 + 1];
      
          return {
            id: i + 1,
            homeTeam,
            awayTeam,
            homeScore: Math.floor(Math.random() * 120),
            awayScore: Math.floor(Math.random() * 120),
            date: new Date().toISOString(),
          };
        });
      }
      
}
