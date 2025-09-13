import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmService } from './confirm.service';
import { NgIconComponent } from '@ng-icons/core';

@Component({
  selector: 'app-confirm',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  template: `
  <div *ngIf="state().show" class="fixed inset-0 z-50">
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"></div>
    <div class="absolute inset-0 flex items-center justify-center p-4">
      <div class="w-full max-w-md bg-white dark:bg-slate-800 dark:text-slate-100 rounded-lg shadow-xl p-5 border border-brand-mid/20 animate-pop-in">
        <h3 class="text-lg font-semibold mb-2">{{state().title}}</h3>
        <p class="text-sm text-slate-600 dark:text-slate-300 mb-4">{{state().message}}</p>
        <div class="flex justify-end gap-2">
          <button (click)="cancel()" class="px-3 py-1.5 rounded border hover:bg-slate-100 dark:hover:bg-slate-700 transition flex items-center gap-1">
            <ng-icon name="heroXMark" class="w-5 h-5"></ng-icon>
            {{state().cancelText}}
          </button>
          <button (click)="confirm()" class="px-3 py-1.5 rounded bg-brand-accent text-white hover:opacity-90 transition flex items-center gap-1">
            <ng-icon name="heroCheckCircle" class="w-5 h-5"></ng-icon>
            {{state().confirmText}}
          </button>
        </div>
      </div>
    </div>
  </div>
  `
})
export class ConfirmComponent {
  private svc = inject(ConfirmService);
  state = computed(() => this.svc.state());
  confirm() { this.svc.confirm(); }
  cancel() { this.svc.cancel(); }
}
