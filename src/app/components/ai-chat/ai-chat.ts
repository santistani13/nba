import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { aiService } from '../../services/ai.service';

@Component({
  selector: 'app-ai-chat',
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-chat.html',
  styleUrl: './ai-chat.css',
})
export class AiChat {
  chat = inject(aiService);
  isOpen = false;
  messages: any[] = [];
  userInput = '';
  constructor() {}
  toggleChat() {
    this.isOpen = !this.isOpen;
  }
  send() {
    this.chat.sendMessage(this.userInput);
    this.userInput = '';
  }
}
