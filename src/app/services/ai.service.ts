import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    typing?: boolean;
    id?: number;
  }
@Injectable({
    providedIn: 'root',
  })
  export class aiService {
    messages = signal<ChatMessage[]>([
        {
          role: 'assistant',
          content: '👋 Hola! Soy tu guía NBA. Preguntame sobre cuanto promedia cada jugador (puntos, asistencias, rebotes). Por ahora solo soporto eso 😅'
        }
      ]);
    baseApi = 'http://localhost:3000/ai/chat';
  constructor(private http: HttpClient) {}

  sendMessage(message: string) {
    if (!message.trim()) return;
  
    this.messages.update(msgs => [
      ...msgs,
      { role: 'user', content: message }
    ]);
  
    this.messages.update(msgs => [
      ...msgs,
      { role: 'assistant', content: '', typing: true }
    ]);
  
    this.http.post(
      this.baseApi,
      { message },
      { responseType: 'text' }  
    ).subscribe({
      next: (res: string) => {
        this.messages.update(msgs => {
          const filtered = msgs.filter(m => !m.typing);
          return [
            ...filtered,
            { role: 'assistant', content: res }
          ];
        });
      },
      error: (err) => {
        this.messages.update(msgs =>
          msgs.filter(m => !m.typing)
        );
      }
    });
  }
  }