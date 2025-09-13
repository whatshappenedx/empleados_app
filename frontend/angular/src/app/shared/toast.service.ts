import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';
export interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private counter = 0;
  toasts = signal<Toast[]>([]);

  show(message: string, type: ToastType = 'info', durationMs = 3000) {
    const id = ++this.counter;
    const toast: Toast = { id, message, type };
    this.toasts.update(list => [...list, toast]);
    setTimeout(() => this.dismiss(id), durationMs);
  }

  success(msg: string, ms = 2500) { this.show(msg, 'success', ms); }
  error(msg: string, ms = 4000) { this.show(msg, 'error', ms); }
  info(msg: string, ms = 3000) { this.show(msg, 'info', ms); }

  dismiss(id: number) {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }
}

