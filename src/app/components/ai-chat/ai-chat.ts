import { CommonModule } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { aiService } from '../../services/ai.service';

@Component({
  selector: 'app-ai-chat',
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-chat.html',
  styleUrl: './ai-chat.css',
})
export class AiChat implements AfterViewChecked {
  chat = inject(aiService);
  isOpen = false;
  messages: any[] = [];
  userInput = '';

  @ViewChild('messagesEl') private messagesEl?: ElementRef<HTMLDivElement>;
  // Firma del último mensaje (largo del array + contenido/estado del
  // último): el placeholder "escribiendo..." se reemplaza por la respuesta
  // real sin cambiar el largo del array, así que solo mirar el count no
  // alcanza para detectar esa transición.
  private lastMessagesSignature = '';

  constructor() {}

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      // Al abrir el chat también arranca abajo del todo, no arriba.
      this.scrollToBottom();
    }
  }

  send() {
    this.chat.sendMessage(this.userInput);
    this.userInput = '';
  }

  // Se corre después de cada render: si cambió la cantidad de mensajes (uno
  // mío o la respuesta de la IA) o cambió el texto del último (streaming/
  // reemplazo del "escribiendo..."), bajamos el scroll del todo.
  ngAfterViewChecked(): void {
    const msgs = this.chat.messages();
    const last = msgs[msgs.length - 1];
    const signature = `${msgs.length}:${last?.content?.length ?? 0}:${last?.typing ? 1 : 0}`;
    if (signature !== this.lastMessagesSignature) {
      this.lastMessagesSignature = signature;
      this.scrollToBottom();
    }
  }

  private scrollToBottom(): void {
    const el = this.messagesEl?.nativeElement;
    if (!el) return;
    // En el próximo frame, ya con el DOM actualizado.
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }
}
