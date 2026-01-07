import { Module } from '@nestjs/common';
import { TeamsDetailService } from './teams-detail.service';
import { TeamsDetailController } from './teams-detail.controller';

@Module({
  controllers: [TeamsDetailController],
  providers: [TeamsDetailService],
})
export class TeamsDetailModule {}
