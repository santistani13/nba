import { Injectable } from '@nestjs/common';

@Injectable()
export class HomeService {

    getOverview(){
        return {
            leaders: {
                ppg: [
                  { id: 77, name: 'Luka Dončić', team: 'LAL', value: 33.9 },
                  { id: 21, name: 'Joel Embiid', team: 'PHI', value: 33.1 },
                  {id:2, name:'Shai Gilgeous-Alexander', team: 'OKC',value:31.2},
                  { id: 34, name: 'Giannis Antetokounmpo', team: 'MIL', value: 30.4 },
                  { id: 30, name: 'Stephen Curry', team: 'GSW', value: 28.4 },
                ],
                apg: [
                  { id: 11, name: 'Tyrese Haliburton', team: 'IND', value: 11.2 },
                  { id: 12, name: 'Trae Young', team: 'ATL', value: 10.8 },
                  { id: 7, name: 'Luka Dončić', team: 'LAL', value: 9.8 },
                  { id: 3, name: 'Nikola Jokić', team: 'DEN', value: 9.6 },
                  { id: 13, name: 'James Harden', team: 'LAC', value: 8.9 },

                ],
                rpg: [
                  { id: 27, name: 'Rudy Gobert', team: 'MIN', value: 12.9 },
                  { id: 15, name: 'Nikola Jokić', team: 'DEN', value: 12.4 },
                  { id: 21, name: 'Joel Embiid', team: 'PHI', value: 11.6 },
                  { id: 23, name: 'Giannis Antetokounmpo', team: 'MIL', value: 10.3 },
                  { id: 19, name: 'Bam Adebayo', team: 'MIA', value: 10.0 },

                ],
              },
              bestTeamsSeason: [
                { id: 1, name: 'Boston Celtics', wins: 52, losses: 14 },
                { id: 2, name: 'Denver Nuggets', wins: 48, losses: 18 },
                { id: 3, name: 'Oklahoma City Thunder', wins: 47, losses: 19 },
                { id: 4, name: 'Minnesota Timberwolves', wins: 46, losses: 20 },
                { id: 5, name: 'Los Angeles Clippers', wins: 44, losses: 22 },
                { id: 6, name: 'Milwaukee Bucks', wins: 43, losses: 23 },
              ],
              mostChampionships: [
                { id: 100, name: 'Boston Celtics', championships: 18 },
                { id: 101, name: 'Los Angeles Lakers', championships: 17 },
                { id: 103, name: 'Golden State Warriors', championships: 6 },
                { id: 102, name: 'Chicago Bulls', championships: 6 },
                { id: 104, name: 'San Antonio Spurs', championships: 5 },
                { id: 105, name: 'Miami Heat', championships: 3 },
              ],
            };
    } }
