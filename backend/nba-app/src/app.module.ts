import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HomeModule } from './home/home.module';
import { TeamsDetailModule } from './teams-detail/teams-detail.module';
import { FavoritosModule } from './favoritos/favoritos.module';
import { MatchResultsModule } from './match-results/match-results.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [HomeModule, TeamsDetailModule, FavoritosModule, MatchResultsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
