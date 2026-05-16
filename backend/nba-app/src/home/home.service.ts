import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

const NBA_TEAMS = [
  { name: 'Atlanta Hawks', abbr: 'ATL' },
  { name: 'Boston Celtics', abbr: 'BOS' },
  { name: 'Brooklyn Nets', abbr: 'BKN' },
  { name: 'Charlotte Hornets', abbr: 'CHA' },
  { name: 'Chicago Bulls', abbr: 'CHI' },
  { name: 'Cleveland Cavaliers', abbr: 'CLE' },
  { name: 'Dallas Mavericks', abbr: 'DAL' },
  { name: 'Denver Nuggets', abbr: 'DEN' },
  { name: 'Detroit Pistons', abbr: 'DET' },
  { name: 'Golden State Warriors', abbr: 'GSW' },
  { name: 'Houston Rockets', abbr: 'HOU' },
  { name: 'Indiana Pacers', abbr: 'IND' },
  { name: 'LA Clippers', abbr: 'LAC' },
  { name: 'Los Angeles Lakers', abbr: 'LAL' },
  { name: 'Memphis Grizzlies', abbr: 'MEM' },
  { name: 'Miami Heat', abbr: 'MIA' },
  { name: 'Milwaukee Bucks', abbr: 'MIL' },
  { name: 'Minnesota Timberwolves', abbr: 'MIN' },
  { name: 'New Orleans Pelicans', abbr: 'NOP' },
  { name: 'New York Knicks', abbr: 'NYK' },
  { name: 'Oklahoma City Thunder', abbr: 'OKC' },
  { name: 'Orlando Magic', abbr: 'ORL' },
  { name: 'Philadelphia 76ers', abbr: 'PHI' },
  { name: 'Phoenix Suns', abbr: 'PHX' },
  { name: 'Portland Trail Blazers', abbr: 'POR' },
  { name: 'Sacramento Kings', abbr: 'SAC' },
  { name: 'San Antonio Spurs', abbr: 'SAS' },
  { name: 'Toronto Raptors', abbr: 'TOR' },
  { name: 'Utah Jazz', abbr: 'UTA' },
  { name: 'Washington Wizards', abbr: 'WAS' },
];

const GAME_TIMES = ['7:00 PM ET', '7:30 PM ET', '8:00 PM ET', '8:30 PM ET', '9:00 PM ET', '9:30 PM ET', '10:00 PM ET'];

@Injectable()
export class HomeService {
  constructor(private prisma: PrismaService) {}

  async getOverview() {
    const [topByPpg, topByApg, topByRpg] = await Promise.all([
      this.getTopByStat('ppg'),
      this.getTopByStat('apg'),
      this.getTopByStat('rpg'),
    ]);

    return {
      leaders: { ppg: topByPpg, apg: topByApg, rpg: topByRpg },
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
  }

  getGames() {
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const rng = this.seededRng(seed);

    const shuffled = [...NBA_TEAMS].sort(() => rng() - 0.5);

    return Array.from({ length: 7 }, (_, i) => ({
      id: i + 1,
      away: shuffled[i * 2],
      home: shuffled[i * 2 + 1],
      time: GAME_TIMES[Math.floor(rng() * GAME_TIMES.length)],
    }));
  }

  private seededRng(seed: number) {
    let s = seed >>> 0;
    return () => {
      s = (Math.imul(1664525, s) + 1013904223) >>> 0;
      return s / 0x100000000;
    };
  }

  private async getTopByStat(stat: 'ppg' | 'apg' | 'rpg') {
    const players = await this.prisma.playerStats.findMany({
      orderBy: { [stat]: 'desc' },
      take: 5,
      include: { player: { include: { team: true } } },
    });

    return players.map((s) => ({
      id: s.player.id,
      name: `${s.player.first_name} ${s.player.last_name}`,
      team: s.player.team.abbreviation,
      value: s[stat],
    }));
  }
}