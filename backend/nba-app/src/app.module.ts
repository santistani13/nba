import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HomeModule } from './home/home.module';
import { TeamsDetailModule } from './teams-detail/teams-detail.module';
import { FavoritosModule } from './favoritos/favoritos.module';
import { MatchResultsModule } from './match-results/match-results.module';
import { AuthModule } from './auth/auth.module';
import { JugadoresModule } from './jugadores/jugadores.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [HomeModule, TeamsDetailModule, FavoritosModule, MatchResultsModule, AuthModule, JugadoresModule, AiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
