import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService, Employee, FamilyMember } from '../services/api.service';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../shared/toast.service';
import { ConfirmService } from '../shared/confirm.service';
import { NgIconComponent } from '@ng-icons/core';
import { EmployeeModalComponent } from './employee-modal.component';
import { EmployeeFamilyModalComponent } from './employee-family-modal.component';

@Component({
  standalone: true,
  selector: 'app-employees-list',
  imports: [CommonModule, RouterLink, FormsModule, NgIconComponent, EmployeeModalComponent, EmployeeFamilyModalComponent],
  template: `
    <div class="mb-4 flex items-center gap-2">
      <input [(ngModel)]="q" (ngModelChange)="search()" type="search" placeholder="Buscar..."
             class="border border-brand-mid rounded px-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-brand-dark dark:bg-slate-900 dark:border-slate-600 dark:text-slate-100 dark:placeholder-slate-400" />
      <button (click)="createOpen = true" class="p-2 rounded bg-brand-accent text-white hover:opacity-90" title="Nuevo" aria-label="Nuevo">
        <ng-icon name="heroPlus" class="w-5 h-5"></ng-icon>
      </button>
    </div>

    <div class="overflow-x-auto bg-white dark:bg-slate-800 shadow rounded">
      <table class="min-w-full text-sm">
        <thead class="bg-brand-light text-slate-700 dark:bg-slate-700 dark:text-slate-100">
          <tr>
            <th class="text-left p-3">Nombre</th>
            <th class="text-left p-3">Correo</th>
            <th class="text-left p-3">Cargo</th>
            <th class="text-left p-3">Ingreso</th>
            <th class="p-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <ng-container *ngFor="let e of items">
            <tr class="border-t border-brand-mid/50 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700">
              <td class="p-3 font-medium">{{e.nombre}}</td>
              <td class="p-3">{{e.correo}}</td>
              <td class="p-3"><span class="px-2 py-0.5 rounded bg-brand-dark/10 text-brand-darkest dark:bg-slate-600/40 dark:text-slate-100">{{e.cargo}}</span></td>
              <td class="p-3">{{e.fecha_ingreso}}</td>
              <td class="p-3 flex gap-2 justify-center">
                <button (click)="startEdit(e)" class="p-2 rounded border border-brand-mid hover:bg-brand-light dark:border-slate-600 dark:hover:bg-slate-700" title="Editar" aria-label="Editar">
                  <ng-icon name="heroPencilSquare" class="w-5 h-5"></ng-icon>
                </button>
                <button (click)="remove(e)" class="p-2 rounded border border-brand-mid text-red-600 hover:bg-red-50 dark:border-slate-600 dark:hover:bg-red-900/20" title="Eliminar" aria-label="Eliminar">
                  <ng-icon name="heroTrash" class="w-5 h-5"></ng-icon>
                </button>
                <button (click)="openFamily(e)" class="p-2 rounded border border-brand-mid hover:bg-brand-light dark:border-slate-600 dark:hover:bg-slate-700" title="Familiares" aria-label="Familiares">
                  <ng-icon name="heroUserGroup" class="w-5 h-5"></ng-icon>
                </button>
              </td>
            </tr>
            
          </ng-container>
        </tbody>
      </table>
    </div>

    <div class="mt-4 flex items-center gap-2">
      <button (click)="prev()" [disabled]="page===1" class="p-2 rounded border border-brand-mid disabled:opacity-50 dark:border-slate-600" title="Anterior" aria-label="Anterior">
        <ng-icon name="heroChevronLeft" class="w-5 h-5"></ng-icon>
      </button>
      <span>Página {{page}} de {{pages}}</span>
      <button (click)="next()" [disabled]="page>=pages" class="p-2 rounded border border-brand-mid disabled:opacity-50 dark:border-slate-600" title="Siguiente" aria-label="Siguiente">
        <ng-icon name="heroChevronRight" class="w-5 h-5"></ng-icon>
      </button>
    </div>

    <app-employee-modal [open]="createOpen" (closed)="createOpen=false" (saved)="onSaved()" />
    <app-employee-modal [open]="editOpen" [employee]="editing" (closed)="editOpen=false; editing=null" (saved)="onSaved()" />
    <app-employee-family-modal [open]="familyOpen" [employee]="familyEmployee" (closed)="familyOpen=false; familyEmployee=null" (changed)="onFamilyChanged()" />
  `
})
export class EmployeesListComponent implements OnInit {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  private confirmSvc = inject(ConfirmService);
  items: Employee[] = [];
  page = 1; limit = 10; total = 0; pages = 1; q = '';
  expandedId: number | null = null; // no longer used for modal flow
  relatives: Record<number, FamilyMember[]> = {}; // kept for compatibility
  form: FamilyMember = { nombre_familiar: '', parentesco: '' }; // kept for compatibility
  createOpen = false;
  editOpen = false;
  editing: Employee | null = null;
  familyOpen = false;
  familyEmployee: Employee | null = null;

  ngOnInit() { this.load(); }

  load() {
    this.api.listEmployees(this.page, this.limit, this.q).subscribe({
      next: (res) => { this.items = res.items; this.total = res.total; this.pages = Math.max(1, Math.ceil(res.total / this.limit)); },
      error: () => this.toast.error('No se pudo cargar el listado')
    });
  }

  search() { this.page = 1; this.load(); }
  next() { if (this.page < this.pages) { this.page++; this.load(); } }
  prev() { if (this.page > 1) { this.page--; this.load(); } }

  async remove(e: Employee) {
    if (!e.id) return;
    const ok = await this.confirmSvc.open({
      title: 'Eliminar empleado',
      message: `¿Seguro que deseas eliminar a "${e.nombre}"?`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar'
    });
    if (!ok) return;
    this.api.deleteEmployee(e.id).subscribe({
      next: () => { this.toast.success('Empleado eliminado'); this.load(); },
      error: (err) => this.toast.error(err?.error?.message || 'Error eliminando')
    });
  }

  startEdit(e: Employee) { this.editing = e; this.editOpen = true; }
  openFamily(e: Employee) { this.familyEmployee = e; this.familyOpen = true; }

  addRelative(e: Employee) { /* handled in modal */ }

  async removeRelative(r: FamilyMember) { /* handled in modal */ }

  onSaved() { this.load(); }
  onFamilyChanged() { this.load(); }

  onCreated() { this.load(); }
}
