import { Module } from '@nestjs/common';
import { TeamsDetailService } from './teams-detail.service';
import { TeamsDetailController } from './teams-detail.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [TeamsDetailController],
  providers: [TeamsDetailService, PrismaService],
})
export class TeamsDetailModule {}
