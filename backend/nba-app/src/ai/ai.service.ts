import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from 'prisma/prisma.service';
@Injectable()
export class AiService {
    constructor(private readonly httpService: HttpService, private prisma: PrismaService) {}
    async askModel(message: string) {
        const intent = await this.detectIntent(message);
      
        const data = await this.executeAction(intent);
      
        if (data.error) {
          return data.error;
        }
      
        return this.generateFinalAnswer(message, data);
      }


      async detectIntent(message: string) {
        const prompt = `
      Eres un sistema que convierte preguntas NBA en acciones JSON.
      
      Devuelve SOLO JSON válido.
      
      Acciones posibles:
      - get_player_stat
      - get_top_players
      - get_team_info
      
      Formato:
      {
        "action": "string",
        "player": "string | null",
        "stat": "ppg | rpg | apg | null"
      }
      
      Pregunta:
      ${message}
      `;
      
        const response = await firstValueFrom(
          this.httpService.post('http://localhost:11434/api/generate', {
            model: 'llama3',
            prompt,
            stream: false,
          }),
        );
      
        return JSON.parse(response.data.response);
      }
      async executeAction(parsed: any) {
        if (parsed.action === 'get_player_stat') {
      
          const nameParts = parsed.player.split(' ');
      
          const player = await this.prisma.player.findFirst({
            where: {
              AND: [
                {
                  first_name: {
                    contains: nameParts[0],
                    mode: 'insensitive'
                  }
                },
                nameParts[1]
                  ? {
                      last_name: {
                        contains: nameParts[1],
                        mode: 'insensitive'
                      }
                    }
                  : {}
              ]
            },
            include: {
              stats: true,
              team: true
            }
          });
      
          if (!player || !player.stats) {
            return { error: 'Jugador no encontrado' };
          }
      
          return {
            player: `${player.first_name} ${player.last_name}`,
            team: player.team.full_name,
            stat: parsed.stat,
            value: player.stats[parsed.stat]
          };
        }
      
        return { error: 'Acción no soportada' };
      }
      async generateFinalAnswer(originalQuestion: string, data: any) {
        const prompt = `
      Actúa como analista profesional de NBA.
      
      Datos reales obtenidos de la base:
      Jugador: ${data.player}
      Equipo: ${data.team}
      Estadística: ${data.stat}
      Valor: ${data.value}
      
      Responde la siguiente pregunta:
      ${originalQuestion}
      `;
      
        const response = await firstValueFrom(
          this.httpService.post('http://localhost:11434/api/generate', {
            model: 'llama3',
            prompt,
            stream: false,
          }),
        );
      
        return response.data.response;
      }
}
