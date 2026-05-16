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

Devuelve SOLO JSON válido, sin texto adicional, sin markdown, sin explicaciones.

Acciones posibles:
- get_player_stat: cuando preguntan por un stat de UN jugador
- compare_players: cuando comparan DOS jugadores o preguntan quién es mejor entre dos
- predict_winner: cuando preguntan quién va a ganar un partido entre dos equipos

Formato para get_player_stat:
{
  "action": "get_player_stat",
  "player": "Nombre Apellido",
  "players": null,
  "teams": null,
  "stat": "ppg | rpg | apg"
}

Formato para compare_players:
{
  "action": "compare_players",
  "player": null,
  "players": ["Jugador 1", "Jugador 2"],
  "teams": null,
  "stat": "ppg | rpg | apg | null"
}

Formato para predict_winner:
{
  "action": "predict_winner",
  "player": null,
  "players": null,
  "teams": ["Equipo 1", "Equipo 2"],
  "stat": null
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
      
        const raw: string = response.data.response;
        const jsonStr = (raw.match(/\{[\s\S]*\}/) ?? raw.match(/\{[\s\S]*/))?.at(0);
        if (!jsonStr) throw new Error(`Ollama no devolvió JSON: ${raw}`);

        let parsed: any;
        try {
          parsed = JSON.parse(jsonStr);
        } catch {
          parsed = JSON.parse(jsonStr + '}');
        }

        // el modelo a veces devuelve el template literal en vez de null
        if (typeof parsed.stat === 'string' && parsed.stat.includes('|')) parsed.stat = null;

        return parsed;
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
      
        if (parsed.action === 'compare_players') {
          const playersData = await Promise.all(
            (parsed.players as string[]).map((name) => {
              const nameParts = name.split(' ');
              return this.prisma.player.findFirst({
                where: {
                  AND: [
                    { first_name: { contains: nameParts[0], mode: 'insensitive' } },
                    nameParts[1] ? { last_name: { contains: nameParts[1], mode: 'insensitive' } } : {}
                  ]
                },
                include: { stats: true, team: true }
              });
            })
          );

          if (playersData.some((p) => !p || !p.stats)) {
            return { error: 'Uno o ambos jugadores no fueron encontrados en la base de datos' };
          }

          return {
            comparison: playersData.map((p) => ({
              player: `${p!.first_name} ${p!.last_name}`,
              team: p!.team.full_name,
              stats: { ppg: p!.stats!.ppg, rpg: p!.stats!.rpg, apg: p!.stats!.apg }
            }))
          };
        }

        if (parsed.action === 'predict_winner') {
          return { prediction: { teams: parsed.teams as string[] } };
        }

        return { error: 'Acción no soportada' };
      }
      async generateFinalAnswer(originalQuestion: string, data: any) {
        let contextBlock: string;
        if (data.comparison) {
          contextBlock = `Comparación de jugadores:\n\n${data.comparison.map((p: any) =>
            `${p.player} (${p.team}):\n  PPG: ${p.stats.ppg}\n  RPG: ${p.stats.rpg}\n  APG: ${p.stats.apg}`
          ).join('\n\n')}`;
        } else if (data.prediction) {
          contextBlock = `Partido del día: ${data.prediction.teams[0]} vs ${data.prediction.teams[1]}`;
        } else {
          contextBlock = `Jugador: ${data.player}\nEquipo: ${data.team}\nEstadística: ${data.stat}\nValor: ${data.value}`;
        }

        const prompt = `
Actúa como analista profesional de NBA. Responde en español.

Datos reales de la base de datos:
${contextBlock}

Responde la siguiente pregunta de forma clara y fundamentada en los datos:
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
