import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { TeamsDetailService } from './teams-detail.service';

@Controller('teams')
export class TeamsDetailController {
  constructor(private readonly teamsDetailService: TeamsDetailService) {}

  @Get(':id')
  getTeamDetail(@Param('id', ParseIntPipe) id:number){
    return this.teamsDetailService.getTeamDetail(id);
  }
}
