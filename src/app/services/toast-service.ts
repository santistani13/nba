import { Injectable, signal } from '@angular/core';
import { ToastModel } from '../models/toastModel';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toast = signal<ToastModel | null>(null);

  
  private show(toast: ToastModel) {
    this.toast.set(toast);

    if (toast.duration > 0) {
      setTimeout(() => this.clear(), toast.duration);
    }
  }

  success(message: string, options?: Partial<ToastModel>) {
    this.show({
      type: 'success',
      message,
      duration: 3000,
      position: 'top-right',
      ...options,
    });
  }

  error(message: string, options?: Partial<ToastModel>) {
    this.show({
      type: 'error',
      message,
      duration: 4000,
      position: 'top-right',
      ...options,
    });
  }

  warning(message: string, options?: Partial<ToastModel>) {
    this.show({
      type: 'warning',
      message,
      duration: 3500,
      position: 'top-right',
      ...options,
    });
  }

  info(message: string, options?: Partial<ToastModel>) {
    this.show({
      type: 'info',
      message,
      duration: 3000,
      position: 'top-right',
      ...options,
    });
  }

  clear() {
    this.toast.set(null);
  }
}
