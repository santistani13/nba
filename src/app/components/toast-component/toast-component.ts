import { Component, effect, inject, signal } from '@angular/core';
import { ToastService } from '../../services/toast-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast-component',
  imports: [CommonModule],
  templateUrl: './toast-component.html',
  styleUrl: './toast-component.css',
  
})
export class ToastComponent {
  toastService = inject(ToastService);
  toast = this.toastService.toast;
  visible = signal(false)
  constructor(){
    effect(() => {
      if (this.toast()) {
        this.visible.set(false);
        requestAnimationFrame(() => {
          this.visible.set(true);
        });
      } else {
        this.visible.set(false);
      }
    });
  }
}
