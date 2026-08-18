import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Same 30-team ordering/IDs already used across the app (see home.service.ts NBA_TEAMS
// and mock/teamDetal.data.ts) so foreign keys line up with the rest of the codebase.
const TEAMS = [
  { id: 1,  abbreviation: 'ATL', city: 'Atlanta',       conference: 'East', division: 'Southeast', name: 'Hawks',        full_name: 'Atlanta Hawks' },
  { id: 2,  abbreviation: 'BOS', city: 'Boston',         conference: 'East', division: 'Atlantic',  name: 'Celtics',      full_name: 'Boston Celtics' },
  { id: 3,  abbreviation: 'BKN', city: 'Brooklyn',       conference: 'East', division: 'Atlantic',  name: 'Nets',         full_name: 'Brooklyn Nets' },
  { id: 4,  abbreviation: 'CHA', city: 'Charlotte',      conference: 'East', division: 'Southeast', name: 'Hornets',      full_name: 'Charlotte Hornets' },
  { id: 5,  abbreviation: 'CHI', city: 'Chicago',        conference: 'East', division: 'Central',   name: 'Bulls',        full_name: 'Chicago Bulls' },
  { id: 6,  abbreviation: 'CLE', city: 'Cleveland',      conference: 'East', division: 'Central',   name: 'Cavaliers',    full_name: 'Cleveland Cavaliers' },
  { id: 7,  abbreviation: 'DAL', city: 'Dallas',         conference: 'West', division: 'Southwest', name: 'Mavericks',    full_name: 'Dallas Mavericks' },
  { id: 8,  abbreviation: 'DEN', city: 'Denver',         conference: 'West', division: 'Northwest', name: 'Nuggets',      full_name: 'Denver Nuggets' },
  { id: 9,  abbreviation: 'DET', city: 'Detroit',        conference: 'East', division: 'Central',   name: 'Pistons',      full_name: 'Detroit Pistons' },
  { id: 10, abbreviation: 'GSW', city: 'Golden State',   conference: 'West', division: 'Pacific',   name: 'Warriors',     full_name: 'Golden State Warriors' },
  { id: 11, abbreviation: 'HOU', city: 'Houston',        conference: 'West', division: 'Southwest', name: 'Rockets',      full_name: 'Houston Rockets' },
  { id: 12, abbreviation: 'IND', city: 'Indiana',        conference: 'East', division: 'Central',   name: 'Pacers',       full_name: 'Indiana Pacers' },
  { id: 13, abbreviation: 'LAC', city: 'LA',             conference: 'West', division: 'Pacific',   name: 'Clippers',     full_name: 'LA Clippers' },
  { id: 14, abbreviation: 'LAL', city: 'Los Angeles',    conference: 'West', division: 'Pacific',   name: 'Lakers',       full_name: 'Los Angeles Lakers' },
  { id: 15, abbreviation: 'MEM', city: 'Memphis',        conference: 'West', division: 'Southwest', name: 'Grizzlies',    full_name: 'Memphis Grizzlies' },
  { id: 16, abbreviation: 'MIA', city: 'Miami',          conference: 'East', division: 'Southeast', name: 'Heat',         full_name: 'Miami Heat' },
  { id: 17, abbreviation: 'MIL', city: 'Milwaukee',      conference: 'East', division: 'Central',   name: 'Bucks',        full_name: 'Milwaukee Bucks' },
  { id: 18, abbreviation: 'MIN', city: 'Minnesota',      conference: 'West', division: 'Northwest', name: 'Timberwolves', full_name: 'Minnesota Timberwolves' },
  { id: 19, abbreviation: 'NOP', city: 'New Orleans',    conference: 'West', division: 'Southwest', name: 'Pelicans',     full_name: 'New Orleans Pelicans' },
  { id: 20, abbreviation: 'NYK', city: 'New York',       conference: 'East', division: 'Atlantic',  name: 'Knicks',       full_name: 'New York Knicks' },
  { id: 21, abbreviation: 'OKC', city: 'Oklahoma City',  conference: 'West', division: 'Northwest', name: 'Thunder',      full_name: 'Oklahoma City Thunder' },
  { id: 22, abbreviation: 'ORL', city: 'Orlando',        conference: 'East', division: 'Southeast', name: 'Magic',        full_name: 'Orlando Magic' },
  { id: 23, abbreviation: 'PHI', city: 'Philadelphia',   conference: 'East', division: 'Atlantic',  name: '76ers',        full_name: 'Philadelphia 76ers' },
  { id: 24, abbreviation: 'PHX', city: 'Phoenix',        conference: 'West', division: 'Pacific',   name: 'Suns',         full_name: 'Phoenix Suns' },
  { id: 25, abbreviation: 'POR', city: 'Portland',       conference: 'West', division: 'Northwest', name: 'Trail Blazers',full_name: 'Portland Trail Blazers' },
  { id: 26, abbreviation: 'SAC', city: 'Sacramento',     conference: 'West', division: 'Pacific',   name: 'Kings',        full_name: 'Sacramento Kings' },
  { id: 27, abbreviation: 'SAS', city: 'San Antonio',    conference: 'West', division: 'Southwest', name: 'Spurs',        full_name: 'San Antonio Spurs' },
  { id: 28, abbreviation: 'TOR', city: 'Toronto',        conference: 'East', division: 'Atlantic',  name: 'Raptors',      full_name: 'Toronto Raptors' },
  { id: 29, abbreviation: 'UTA', city: 'Utah',           conference: 'West', division: 'Northwest', name: 'Jazz',         full_name: 'Utah Jazz' },
  { id: 30, abbreviation: 'WAS', city: 'Washington',     conference: 'East', division: 'Southeast', name: 'Wizards',      full_name: 'Washington Wizards' },
];

// A couple of recognizable players per team, with approximate stat lines —
// enough for the AI chat (get_player_stat / compare_players / predict_winner)
// and the home leaders board to have real rows to query instead of an empty table.
interface SeedPlayer {
  first_name: string; last_name: string; position: string;
  height_feet: number; height_inches: number; weight_pounds: number;
  teamId: number; ppg: number; rpg: number; apg: number;
}

const PLAYERS: SeedPlayer[] = [
  { first_name: 'Trae',      last_name: 'Young',           position: 'G',  height_feet: 6, height_inches: 1,  weight_pounds: 164, teamId: 1,  ppg: 26.4, rpg: 2.8,  apg: 10.8 },
  { first_name: 'Jalen',     last_name: 'Johnson',         position: 'F',  height_feet: 6, height_inches: 8,  weight_pounds: 220, teamId: 1,  ppg: 18.9, rpg: 8.7,  apg: 5.0 },
  { first_name: 'Jayson',    last_name: 'Tatum',           position: 'F',  height_feet: 6, height_inches: 8,  weight_pounds: 210, teamId: 2,  ppg: 27.1, rpg: 8.4,  apg: 6.0 },
  { first_name: 'Jaylen',    last_name: 'Brown',           position: 'G-F',height_feet: 6, height_inches: 6,  weight_pounds: 223, teamId: 2,  ppg: 23.0, rpg: 5.5,  apg: 3.6 },
  { first_name: 'Mikal',     last_name: 'Bridges',         position: 'F',  height_feet: 6, height_inches: 6,  weight_pounds: 209, teamId: 3,  ppg: 17.6, rpg: 4.5,  apg: 3.4 },
  { first_name: 'Cam',       last_name: 'Thomas',          position: 'G',  height_feet: 6, height_inches: 3,  weight_pounds: 210, teamId: 3,  ppg: 22.5, rpg: 3.2,  apg: 3.9 },
  { first_name: 'LaMelo',    last_name: 'Ball',            position: 'G',  height_feet: 6, height_inches: 7,  weight_pounds: 180, teamId: 4,  ppg: 25.2, rpg: 5.8,  apg: 8.0 },
  { first_name: 'Miles',     last_name: 'Bridges',         position: 'F',  height_feet: 6, height_inches: 6,  weight_pounds: 225, teamId: 4,  ppg: 20.1, rpg: 6.9,  apg: 3.4 },
  { first_name: 'Zach',      last_name: 'LaVine',          position: 'G',  height_feet: 6, height_inches: 5,  weight_pounds: 200, teamId: 5,  ppg: 23.3, rpg: 4.8,  apg: 4.4 },
  { first_name: 'Coby',      last_name: 'White',           position: 'G',  height_feet: 6, height_inches: 5,  weight_pounds: 195, teamId: 5,  ppg: 19.1, rpg: 4.5,  apg: 5.1 },
  { first_name: 'Donovan',   last_name: 'Mitchell',        position: 'G',  height_feet: 6, height_inches: 1,  weight_pounds: 215, teamId: 6,  ppg: 26.6, rpg: 5.1,  apg: 6.1 },
  { first_name: 'Evan',      last_name: 'Mobley',          position: 'F-C',height_feet: 7, height_inches: 0,  weight_pounds: 215, teamId: 6,  ppg: 18.5, rpg: 9.4,  apg: 3.2 },
  { first_name: 'Luka',      last_name: 'Doncic',          position: 'G',  height_feet: 6, height_inches: 7,  weight_pounds: 230, teamId: 7,  ppg: 33.9, rpg: 9.2,  apg: 9.8 },
  { first_name: 'Kyrie',     last_name: 'Irving',          position: 'G',  height_feet: 6, height_inches: 2,  weight_pounds: 195, teamId: 7,  ppg: 25.6, rpg: 5.0,  apg: 5.2 },
  { first_name: 'Nikola',    last_name: 'Jokic',           position: 'C',  height_feet: 6, height_inches: 11, weight_pounds: 284, teamId: 8,  ppg: 26.4, rpg: 12.4, apg: 9.0 },
  { first_name: 'Jamal',     last_name: 'Murray',          position: 'G',  height_feet: 6, height_inches: 4,  weight_pounds: 215, teamId: 8,  ppg: 21.2, rpg: 4.1,  apg: 6.5 },
  { first_name: 'Cade',      last_name: 'Cunningham',      position: 'G',  height_feet: 6, height_inches: 6,  weight_pounds: 220, teamId: 9,  ppg: 22.7, rpg: 4.3,  apg: 7.5 },
  { first_name: 'Jaden',     last_name: 'Ivey',            position: 'G',  height_feet: 6, height_inches: 4,  weight_pounds: 195, teamId: 9,  ppg: 15.8, rpg: 3.9,  apg: 4.5 },
  { first_name: 'Stephen',   last_name: 'Curry',           position: 'G',  height_feet: 6, height_inches: 2,  weight_pounds: 185, teamId: 10, ppg: 26.4, rpg: 4.5,  apg: 5.1 },
  { first_name: 'Draymond',  last_name: 'Green',           position: 'F',  height_feet: 6, height_inches: 6,  weight_pounds: 230, teamId: 10, ppg: 8.6,  rpg: 7.2,  apg: 6.0 },
  { first_name: 'Klay',      last_name: 'Thompson',        position: 'G',  height_feet: 6, height_inches: 6,  weight_pounds: 215, teamId: 10, ppg: 17.9, rpg: 3.3,  apg: 2.3 },
  { first_name: 'Alperen',   last_name: 'Sengun',          position: 'C',  height_feet: 6, height_inches: 11, weight_pounds: 243, teamId: 11, ppg: 19.1, rpg: 9.3,  apg: 5.0 },
  { first_name: 'Jalen',     last_name: 'Green',           position: 'G',  height_feet: 6, height_inches: 4,  weight_pounds: 186, teamId: 11, ppg: 19.6, rpg: 5.2,  apg: 3.3 },
  { first_name: 'Tyrese',    last_name: 'Haliburton',      position: 'G',  height_feet: 6, height_inches: 5,  weight_pounds: 185, teamId: 12, ppg: 18.6, rpg: 3.9,  apg: 9.2 },
  { first_name: 'Pascal',    last_name: 'Siakam',          position: 'F',  height_feet: 6, height_inches: 8,  weight_pounds: 230, teamId: 12, ppg: 20.2, rpg: 6.9,  apg: 3.5 },
  { first_name: 'James',     last_name: 'Harden',          position: 'G',  height_feet: 6, height_inches: 5,  weight_pounds: 220, teamId: 13, ppg: 22.8, rpg: 5.8,  apg: 8.7 },
  { first_name: 'Kawhi',     last_name: 'Leonard',         position: 'F',  height_feet: 6, height_inches: 7,  weight_pounds: 225, teamId: 13, ppg: 21.3, rpg: 6.1,  apg: 3.6 },
  { first_name: 'LeBron',    last_name: 'James',           position: 'F',  height_feet: 6, height_inches: 9,  weight_pounds: 250, teamId: 14, ppg: 25.2, rpg: 7.4,  apg: 8.1 },
  { first_name: 'Anthony',   last_name: 'Davis',           position: 'F-C',height_feet: 6, height_inches: 10, weight_pounds: 253, teamId: 14, ppg: 24.8, rpg: 11.5, apg: 3.4 },
  { first_name: 'Ja',        last_name: 'Morant',          position: 'G',  height_feet: 6, height_inches: 3,  weight_pounds: 174, teamId: 15, ppg: 24.6, rpg: 5.4,  apg: 7.5 },
  { first_name: 'Jaren',     last_name: 'Jackson',         position: 'F-C',height_feet: 6, height_inches: 10, weight_pounds: 242, teamId: 15, ppg: 21.4, rpg: 5.6,  apg: 1.9 },
  { first_name: 'Jimmy',     last_name: 'Butler',          position: 'F',  height_feet: 6, height_inches: 7,  weight_pounds: 230, teamId: 16, ppg: 20.5, rpg: 5.3,  apg: 4.9 },
  { first_name: 'Bam',       last_name: 'Adebayo',         position: 'C',  height_feet: 6, height_inches: 9,  weight_pounds: 255, teamId: 16, ppg: 19.3, rpg: 10.4, apg: 3.9 },
  { first_name: 'Giannis',   last_name: 'Antetokounmpo',   position: 'F',  height_feet: 6, height_inches: 11, weight_pounds: 243, teamId: 17, ppg: 30.4, rpg: 11.5, apg: 6.5 },
  { first_name: 'Damian',    last_name: 'Lillard',         position: 'G',  height_feet: 6, height_inches: 2,  weight_pounds: 195, teamId: 17, ppg: 24.3, rpg: 4.4,  apg: 7.0 },
  { first_name: 'Anthony',   last_name: 'Edwards',         position: 'G',  height_feet: 6, height_inches: 4,  weight_pounds: 225, teamId: 18, ppg: 27.6, rpg: 5.6,  apg: 4.5 },
  { first_name: 'Rudy',      last_name: 'Gobert',          position: 'C',  height_feet: 7, height_inches: 1,  weight_pounds: 258, teamId: 18, ppg: 11.2, rpg: 12.5, apg: 1.5 },
  { first_name: 'Zion',      last_name: 'Williamson',      position: 'F',  height_feet: 6, height_inches: 6,  weight_pounds: 284, teamId: 19, ppg: 22.9, rpg: 5.8,  apg: 5.0 },
  { first_name: 'Brandon',   last_name: 'Ingram',          position: 'F',  height_feet: 6, height_inches: 8,  weight_pounds: 190, teamId: 19, ppg: 20.8, rpg: 5.1,  apg: 5.6 },
  { first_name: 'Jalen',     last_name: 'Brunson',         position: 'G',  height_feet: 6, height_inches: 2,  weight_pounds: 190, teamId: 20, ppg: 28.7, rpg: 3.6,  apg: 6.7 },
  { first_name: 'Karl-Anthony', last_name: 'Towns',        position: 'F-C',height_feet: 7, height_inches: 0,  weight_pounds: 248, teamId: 20, ppg: 22.4, rpg: 9.1,  apg: 3.0 },
  { first_name: 'Shai',      last_name: 'Gilgeous-Alexander', position: 'G', height_feet: 6, height_inches: 6, weight_pounds: 195, teamId: 21, ppg: 32.7, rpg: 5.0, apg: 6.4 },
  { first_name: 'Chet',      last_name: 'Holmgren',        position: 'F-C',height_feet: 7, height_inches: 1,  weight_pounds: 208, teamId: 21, ppg: 16.9, rpg: 7.9,  apg: 2.3 },
  { first_name: 'Paolo',     last_name: 'Banchero',        position: 'F',  height_feet: 6, height_inches: 10, weight_pounds: 250, teamId: 22, ppg: 24.1, rpg: 7.5,  apg: 4.9 },
  { first_name: 'Franz',     last_name: 'Wagner',          position: 'F',  height_feet: 6, height_inches: 9,  weight_pounds: 220, teamId: 22, ppg: 21.4, rpg: 5.3,  apg: 4.6 },
  { first_name: 'Joel',      last_name: 'Embiid',          position: 'C',  height_feet: 7, height_inches: 0,  weight_pounds: 280, teamId: 23, ppg: 27.6, rpg: 10.6, apg: 4.5 },
  { first_name: 'Tyrese',    last_name: 'Maxey',           position: 'G',  height_feet: 6, height_inches: 2,  weight_pounds: 200, teamId: 23, ppg: 25.9, rpg: 3.7,  apg: 6.2 },
  { first_name: 'Kevin',     last_name: 'Durant',          position: 'F',  height_feet: 6, height_inches: 10, weight_pounds: 240, teamId: 24, ppg: 27.1, rpg: 6.6,  apg: 4.2 },
  { first_name: 'Devin',     last_name: 'Booker',          position: 'G',  height_feet: 6, height_inches: 5,  weight_pounds: 206, teamId: 24, ppg: 25.7, rpg: 4.5,  apg: 6.9 },
  { first_name: 'Anfernee',  last_name: 'Simons',          position: 'G',  height_feet: 6, height_inches: 3,  weight_pounds: 181, teamId: 25, ppg: 19.3, rpg: 3.2,  apg: 4.0 },
  { first_name: 'Deandre',   last_name: 'Ayton',           position: 'C',  height_feet: 6, height_inches: 11, weight_pounds: 250, teamId: 25, ppg: 16.2, rpg: 10.4, apg: 1.8 },
  { first_name: 'De’Aaron', last_name: 'Fox',         position: 'G',  height_feet: 6, height_inches: 3,  weight_pounds: 185, teamId: 26, ppg: 26.6, rpg: 4.6,  apg: 6.1 },
  { first_name: 'Domantas',  last_name: 'Sabonis',         position: 'C',  height_feet: 6, height_inches: 11, weight_pounds: 240, teamId: 26, ppg: 19.4, rpg: 13.7, apg: 8.2 },
  { first_name: 'Victor',    last_name: 'Wembanyama',      position: 'F-C',height_feet: 7, height_inches: 4,  weight_pounds: 210, teamId: 27, ppg: 24.3, rpg: 11.0, apg: 3.7 },
  { first_name: 'Devin',     last_name: 'Vassell',         position: 'G',  height_feet: 6, height_inches: 5,  weight_pounds: 200, teamId: 27, ppg: 19.5, rpg: 3.9,  apg: 4.0 },
  { first_name: 'Scottie',   last_name: 'Barnes',          position: 'F',  height_feet: 6, height_inches: 8,  weight_pounds: 225, teamId: 28, ppg: 21.5, rpg: 8.2,  apg: 6.1 },
  { first_name: 'RJ',        last_name: 'Barrett',         position: 'G-F',height_feet: 6, height_inches: 6,  weight_pounds: 214, teamId: 28, ppg: 19.7, rpg: 5.4,  apg: 4.1 },
  { first_name: 'Lauri',     last_name: 'Markkanen',       position: 'F',  height_feet: 7, height_inches: 0,  weight_pounds: 240, teamId: 29, ppg: 22.9, rpg: 8.1,  apg: 1.9 },
  { first_name: 'Walker',    last_name: 'Kessler',         position: 'C',  height_feet: 7, height_inches: 1,  weight_pounds: 245, teamId: 29, ppg: 11.1, rpg: 10.4, apg: 1.2 },
  { first_name: 'Jordan',    last_name: 'Poole',           position: 'G',  height_feet: 6, height_inches: 4,  weight_pounds: 194, teamId: 30, ppg: 17.4, rpg: 2.8,  apg: 4.4 },
  { first_name: 'Kyle',      last_name: 'Kuzma',           position: 'F',  height_feet: 6, height_inches: 9,  weight_pounds: 221, teamId: 30, ppg: 18.6, rpg: 6.6,  apg: 3.4 },
];

async function main() {
  console.log(`Seeding ${TEAMS.length} teams...`);
  for (const team of TEAMS) {
    await prisma.team.upsert({ where: { id: team.id }, update: team, create: team });
  }

  console.log(`Seeding ${PLAYERS.length} players + stats...`);
  for (const p of PLAYERS) {
    const player = await prisma.player.create({
      data: {
        first_name: p.first_name,
        last_name: p.last_name,
        position: p.position,
        height_feet: p.height_feet,
        height_inches: p.height_inches,
        weight_pounds: p.weight_pounds,
        teamId: p.teamId,
      },
    });
    await prisma.playerStats.create({
      data: { playerId: player.id, ppg: p.ppg, rpg: p.rpg, apg: p.apg },
    });
  }

  console.log('Seed complete.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
