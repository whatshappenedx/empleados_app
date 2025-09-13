import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from './toast.service';
import { NgIconComponent } from '@ng-icons/core';

@Component({
  selector: 'app-toaster',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  template: `
  <div class="fixed top-4 right-4 z-50 space-y-2 w-80" aria-live="polite" aria-atomic="true">
    <div *ngFor="let t of toasts()"
         class="rounded shadow-lg p-3 text-sm flex items-start gap-2 border"
         [ngClass]="{
           'bg-green-50 border-green-300 text-green-900 dark:bg-green-900/20 dark:text-green-200 dark:border-green-700': t.type==='success',
           'bg-red-50 border-red-300 text-red-900 dark:bg-red-900/20 dark:text-red-200 dark:border-red-700': t.type==='error',
           'bg-slate-50 border-slate-300 text-slate-900 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600': t.type==='info'
         }">
      <div class="mt-0.5">
        <ng-icon *ngIf="t.type==='success'" name="heroCheckCircle" class="w-5 h-5"></ng-icon>
        <ng-icon *ngIf="t.type==='error'" name="heroXMark" class="w-5 h-5"></ng-icon>
        <ng-icon *ngIf="t.type==='info'" name="heroInformationCircle" class="w-5 h-5"></ng-icon>
      </div>
      <div class="flex-1">{{t.message}}</div>
      <button (click)="dismiss(t.id)" class="text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">✖</button>
    </div>
  </div>
  `
})
export class ToastComponent {
  private toast = inject(ToastService);
  toasts = computed(() => this.toast.toasts());
  dismiss(id: number) { this.toast.dismiss(id); }
}
