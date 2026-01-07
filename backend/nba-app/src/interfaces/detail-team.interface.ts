export interface TeamSeasonStats {
    wins: number;
    losses: number;
    homeWins: number;
    homeLosses: number;
    awayWins: number;
    awayLosses: number;
    last10: {
      wins: number;
      losses: number;
    };
  }
  
  export interface TeamLeader {
    player: string;
    value: number;
  }
  
  export interface TeamChampionships {
    total: number;
    years: number[];
  }
  
  export interface Team {
    id: number;
    name: string;
    abbreviation: string;
    city: string;
    conference: 'East' | 'West';
    logoUrl: string;
  
    seasonStats: TeamSeasonStats;
  
    leaders: {
      pointsPerGame: TeamLeader;
      reboundsPerGame: TeamLeader;
      assistsPerGame: TeamLeader;
    };
  
    championships: TeamChampionships;
  }
  