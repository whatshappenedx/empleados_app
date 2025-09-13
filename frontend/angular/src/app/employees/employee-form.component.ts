import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, Employee } from '../services/api.service';
import { ToastService } from '../shared/toast.service';
import { NgIconComponent } from '@ng-icons/core';

@Component({
  standalone: true,
  selector: 'app-employee-form',
  imports: [CommonModule, FormsModule, NgIconComponent],
  template: `
    <h2 class="text-xl font-semibold mb-4">{{emp.id ? 'Editar' : 'Nuevo'}} empleado</h2>
    <form (ngSubmit)="save()" #f="ngForm" class="space-y-4 max-w-xl">
      <div>
        <label class="block text-sm mb-1">Nombre</label>
        <input [(ngModel)]="emp.nombre" name="nombre" required
               class="border border-brand-mid px-3 py-2 rounded w-full focus:ring-2 focus:ring-brand-dark"
               [ngClass]="{'border-red-400': showError(f, 'nombre')}" />
        <p class="text-xs text-red-600 mt-1" *ngIf="showError(f, 'nombre')">El nombre es requerido</p>
        <p class="text-xs text-red-600" *ngIf="serverErrors.nombre">{{serverErrors.nombre}}</p>
      </div>
      <div>
        <label class="block text-sm mb-1">Correo</label>
        <input [(ngModel)]="emp.correo" name="correo" type="email" required
               class="border border-brand-mid px-3 py-2 rounded w-full focus:ring-2 focus:ring-brand-dark"
               [ngClass]="{'border-red-400': showError(f, 'correo')}" />
        <p class="text-xs text-red-600 mt-1" *ngIf="showError(f, 'correo')">Correo válido requerido</p>
        <p class="text-xs text-red-600" *ngIf="serverErrors.correo">{{serverErrors.correo}}</p>
      </div>
      <div>
        <label class="block text-sm mb-1">Cargo</label>
        <input [(ngModel)]="emp.cargo" name="cargo" required
               class="border border-brand-mid px-3 py-2 rounded w-full focus:ring-2 focus:ring-brand-dark"
               [ngClass]="{'border-red-400': showError(f, 'cargo')}" />
        <p class="text-xs text-red-600 mt-1" *ngIf="showError(f, 'cargo')">El cargo es requerido</p>
        <p class="text-xs text-red-600" *ngIf="serverErrors.cargo">{{serverErrors.cargo}}</p>
      </div>
      <div>
        <label class="block text-sm mb-1">Fecha ingreso</label>
        <input [(ngModel)]="emp.fecha_ingreso" name="fecha_ingreso" placeholder="YYYY-MM-DD"
               pattern="^\\d{4}-\\d{2}-\\d{2}$"
               class="border border-brand-mid px-3 py-2 rounded w-full focus:ring-2 focus:ring-brand-dark"
               [ngClass]="{'border-red-400': invalidDate(f)}" />
        <p class="text-xs text-red-600 mt-1" *ngIf="invalidDate(f)">Formato de fecha YYYY-MM-DD</p>
        <p class="text-xs text-red-600" *ngIf="serverErrors.fecha_ingreso">{{serverErrors.fecha_ingreso}}</p>
      </div>
      <div class="flex gap-2">
        <button [disabled]="f.invalid" class="p-2 rounded bg-brand-accent text-white disabled:opacity-60" title="Guardar" aria-label="Guardar">
          <ng-icon name="heroCheckCircle" class="w-5 h-5"></ng-icon>
        </button>
        <button type="button" (click)="cancel()" class="p-2 rounded border border-brand-mid" title="Cancelar" aria-label="Cancelar">
          <ng-icon name="heroXMark" class="w-5 h-5"></ng-icon>
        </button>
      </div>
    </form>
  `
})
export class EmployeeFormComponent implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(ToastService);

  emp: Employee = { nombre: '', correo: '', cargo: '' };
  serverErrors: Record<string, string> = {};

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) this.api.getEmployee(id).subscribe(e => this.emp = e);
  }

  save() {
    this.serverErrors = {};
    this.api.saveEmployee(this.emp).subscribe({
      next: () => {
        this.toast.success(this.emp.id ? 'Empleado actualizado' : 'Empleado creado');
        this.router.navigateByUrl('/');
      },
      error: (err) => {
        if (err?.status === 422 && err?.error?.errors) {
          this.serverErrors = err.error.errors;
        }
        this.toast.error(err?.error?.message || 'Error al guardar');
      }
    });
  }

  cancel() { this.router.navigateByUrl('/'); }

  showError(form: any, name: string) {
    const c = form?.controls?.[name];
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  invalidDate(form: any) {
    const c = form?.controls?.['fecha_ingreso'];
    return !!c && c.value && c.errors?.['pattern'] && (c.dirty || c.touched);
  }
}
