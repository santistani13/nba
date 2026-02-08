import { Controller, Get } from '@nestjs/common';
import { MatchResultsService } from './match-results.service';

@Controller('matchresults')
export class MatchResultsController {
  constructor(private readonly matchResultsService: MatchResultsService) {}
  @Get('') 
    getMatchResults(){
        return this.matchResultsService.getMatchResults();
    }
}
