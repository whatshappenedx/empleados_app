import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Employee } from '../services/api.service';
import { ToastService } from '../shared/toast.service';
import { NgIconComponent } from '@ng-icons/core';

@Component({
  selector: 'app-employee-create-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIconComponent],
  template: `
  <div *ngIf="open" class="fixed inset-0 z-50">
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" (click)="onClose()"></div>
    <div class="absolute inset-0 flex items-center justify-center p-4">
      <div class="w-full max-w-lg bg-white dark:bg-slate-800 dark:text-slate-100 rounded-xl shadow-2xl border border-brand-mid/50 animate-pop-in">
        <div class="flex items-center justify-between p-4 border-b border-brand-mid/40">
          <h3 class="text-lg font-semibold">Nuevo empleado</h3>
          <button (click)="onClose()" class="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700" title="Cerrar" aria-label="Cerrar">
            <ng-icon name="heroXMark" class="w-5 h-5"></ng-icon>
          </button>
        </div>
        <form (ngSubmit)="save()" #f="ngForm" class="p-4 space-y-4" aria-modal="true" role="dialog">
          <div>
            <label class="block text-sm mb-1">Nombre</label>
            <input [(ngModel)]="emp.nombre" name="nombre" required
                   class="border border-brand-mid px-3 py-2 rounded w-full focus:ring-2 focus:ring-brand-dark dark:bg-slate-900 dark:border-slate-600"
                   [ngClass]="{'border-red-400': showError(f, 'nombre')}" />
            <p class="text-xs text-red-600 mt-1" *ngIf="showError(f, 'nombre')">El nombre es requerido</p>
          </div>
          <div>
            <label class="block text-sm mb-1">Correo</label>
            <input [(ngModel)]="emp.correo" name="correo" type="email" required
                   class="border border-brand-mid px-3 py-2 rounded w-full focus:ring-2 focus:ring-brand-dark dark:bg-slate-900 dark:border-slate-600"
                   [ngClass]="{'border-red-400': showError(f, 'correo')}" />
            <p class="text-xs text-red-600 mt-1" *ngIf="showError(f, 'correo')">Correo válido requerido</p>
          </div>
          <div>
            <label class="block text-sm mb-1">Cargo</label>
            <input [(ngModel)]="emp.cargo" name="cargo" required
                   class="border border-brand-mid px-3 py-2 rounded w-full focus:ring-2 focus:ring-brand-dark dark:bg-slate-900 dark:border-slate-600"
                   [ngClass]="{'border-red-400': showError(f, 'cargo')}" />
            <p class="text-xs text-red-600 mt-1" *ngIf="showError(f, 'cargo')">El cargo es requerido</p>
          </div>
          <div>
            <label class="block text-sm mb-1">Fecha ingreso</label>
            <input [(ngModel)]="emp.fecha_ingreso" name="fecha_ingreso" placeholder="YYYY-MM-DD" pattern="^\\d{4}-\\d{2}-\\d{2}$"
                   class="border border-brand-mid px-3 py-2 rounded w-full focus:ring-2 focus:ring-brand-dark dark:bg-slate-900 dark:border-slate-600"
                   [ngClass]="{'border-red-400': invalidDate(f)}" />
            <p class="text-xs text-red-600 mt-1" *ngIf="invalidDate(f)">Formato de fecha YYYY-MM-DD</p>
          </div>
          <div class="flex justify-end gap-2 pt-2">
            <button type="button" (click)="onClose()" class="p-2 rounded border border-brand-mid dark:border-slate-600" title="Cancelar" aria-label="Cancelar">
              <ng-icon name="heroXMark" class="w-5 h-5"></ng-icon>
            </button>
            <button [disabled]="f.invalid || loading" class="p-2 rounded bg-brand-accent text-white disabled:opacity-60" title="Guardar" aria-label="Guardar">
              <ng-icon name="heroCheckCircle" class="w-5 h-5"></ng-icon>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  `
})
export class EmployeeCreateModalComponent {
  @Input() open = false;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  emp: Employee = { nombre: '', correo: '', cargo: '' };
  loading = false;

  constructor(private api: ApiService, private toast: ToastService) {}

  onClose() { if (!this.loading) { this.closed.emit(); this.emp = { nombre: '', correo: '', cargo: '' }; } }

  save() {
    this.loading = true;
    this.api.saveEmployee(this.emp).subscribe({
      next: () => {
        this.toast.success('Empleado creado');
        this.loading = false;
        this.saved.emit();
        this.onClose();
      },
      error: (err) => {
        this.toast.error(err?.error?.message || 'Error al crear empleado');
        this.loading = false;
      }
    });
  }

  showError(form: any, name: string) {
    const c = form?.controls?.[name];
    return !!c && c.invalid && (c.dirty || c.touched);
  }
  invalidDate(form: any) {
    const c = form?.controls?.['fecha_ingreso'];
    return !!c && c.value && c.errors?.['pattern'] && (c.dirty || c.touched);
  }
}
