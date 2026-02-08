export class MatchResultDto {
    id: number;
  
    homeTeam: {
      id: number;
      name: string;
      abbreviation: string;
      logo?: string;
    };
  
    awayTeam: {
      id: number;
      name: string;
      abbreviation: string;
      logo?: string;
    };
  
    homeScore: number;
    awayScore: number;
  
    date: string; // ISO
  }
  