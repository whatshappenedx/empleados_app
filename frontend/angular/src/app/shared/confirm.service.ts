import { Injectable, signal } from '@angular/core';

interface ConfirmState {
  show: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  resolver?: (value: boolean) => void;
}

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  state = signal<ConfirmState>({
    show: false,
    title: 'Confirmar',
    message: '¿Deseas continuar?',
    confirmText: 'Confirmar',
    cancelText: 'Cancelar'
  });

  open(opts: Partial<ConfirmState>): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.state.update(s => ({
        ...s,
        ...opts,
        show: true,
        resolver: resolve
      }));
    });
  }

  confirm() {
    const r = this.state().resolver; r?.(true);
    this.close();
  }

  cancel() {
    const r = this.state().resolver; r?.(false);
    this.close();
  }

  private close() {
    this.state.update(s => ({ ...s, show: false, resolver: undefined }));
  }
}

