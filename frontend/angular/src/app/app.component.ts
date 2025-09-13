import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/toast.component';
import { ConfirmComponent } from './shared/confirm.component';
import { NgIconComponent } from '@ng-icons/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, ToastComponent, ConfirmComponent, NgIconComponent],
  template: `
  <app-toaster />
  <app-confirm />
  <div class="min-h-screen bg-gradient-to-b from-brand-light to-brand-mid/30 text-slate-800 transition-colors duration-300 dark:from-slate-900 dark:to-slate-800 dark:text-slate-100">
    <header class="bg-slate-950/90 dark:bg-slate-950/90 backdrop-blur sticky top-0 z-40 border-b border-brand-mid/40">
      <div class="container mx-auto px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <img src="assets/favicon.svg" alt="logo" class="w-7 h-7" />
          <h1 class="text-xl font-semibold tracking-wide text-white">Gestión de Empleados</h1>
        </div>
        <nav class="flex items-center gap-2">
          <button (click)="toggleDark()" class="p-2 rounded border border-white/30 text-white hover:bg-black/10" [attr.title]="isDark ? 'Modo claro' : 'Modo oscuro'" aria-label="Cambiar tema">
            <ng-container *ngIf="!isDark; else sun">
              <ng-icon name="heroMoon" class="w-5 h-5"></ng-icon>
            </ng-container>
            <ng-template #sun>
              <ng-icon name="heroSun" class="w-5 h-5"></ng-icon>
            </ng-template>
          </button>
        </nav>
      </div>
    </header>
    <main class="container mx-auto px-4 py-6">
      <div class="bg-white/95 dark:bg-slate-800/90 dark:text-slate-100 rounded-lg shadow-md p-4 transition">
        <router-outlet />
      </div>
    </main>
    <footer class="py-6 text-center text-xs text-slate-600 dark:text-slate-400">© {{ year }} Isaac Armijos</footer>
  </div>
  `
})
export class AppComponent {
  isDark = false;
  year = new Date().getFullYear();
  toggleDark() {
    this.isDark = !this.isDark;
    const root = document.documentElement;
    root.classList.toggle('dark', this.isDark);
  }
}
