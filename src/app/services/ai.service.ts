import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
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
          content: '👋 Hola! Soy tu guía NBA. Puedo decirte cuánto promedia cualquier jugador, comparar dos y decirte quién se la come al otro 😏, o darte mi opinión sobre los partidos de hoy y decirte quién va a ganar 🏀'
        }
      ]);
    baseApi = `${environment.apiUrl}/ai/chat`;
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