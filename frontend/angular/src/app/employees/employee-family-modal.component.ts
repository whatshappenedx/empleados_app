import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Employee, FamilyMember } from '../services/api.service';
import { ToastService } from '../shared/toast.service';
import { ConfirmService } from '../shared/confirm.service';
import { NgIconComponent } from '@ng-icons/core';

@Component({
  selector: 'app-employee-family-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIconComponent],
  template: `
  <div *ngIf="open" class="fixed inset-0 z-50">
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" (click)="onClose()"></div>
    <div class="absolute inset-0 flex items-center justify-center p-4">
      <div class="w-full max-w-2xl bg-white dark:bg-slate-800 dark:text-slate-100 rounded-xl shadow-2xl border border-brand-mid/50 animate-pop-in">
        <div class="flex items-center justify-between p-4 border-b border-brand-mid/40">
          <h3 class="text-lg font-semibold">Familiares — {{employee?.nombre}}</h3>
          <button (click)="onClose()" class="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700" title="Cerrar" aria-label="Cerrar">
            <ng-icon name="heroXMark" class="w-5 h-5"></ng-icon>
          </button>
        </div>
        <div class="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 class="font-semibold mb-2">Listado</h4>
            <ul class="divide-y rounded border border-brand-mid/50 bg-white dark:bg-slate-900 dark:border-slate-700">
              <li *ngFor="let r of list" class="flex items-center justify-between py-2 px-3">
                <span>{{r.nombre_familiar}} ({{r.parentesco}}) — {{r.fecha_nacimiento || '—'}}</span>
                <button (click)="remove(r)" class="p-1.5 rounded border border-brand-mid text-red-600 hover:bg-red-50 dark:border-slate-600 dark:hover:bg-red-900/20" title="Eliminar" aria-label="Eliminar">
                  <ng-icon name="heroTrash" class="w-5 h-5"></ng-icon>
                </button>
              </li>
              <li *ngIf="list.length===0" class="py-2 px-3 text-sm text-slate-500 dark:text-slate-400">Sin familiares registrados.</li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold mb-2">Agregar familiar</h4>
            <form (ngSubmit)="add()" #f="ngForm" class="space-y-2">
              <div>
                <input class="border border-brand-mid w-full px-2 py-1 rounded focus:ring-2 focus:ring-brand-dark dark:bg-slate-900 dark:border-slate-600 dark:text-slate-100 dark:placeholder-slate-400"
                       [ngClass]="{'border-red-400': showError(f, 'nombre_familiar')}"
                       name="nombre_familiar" [(ngModel)]="form.nombre_familiar" placeholder="Nombre" required maxlength="255" />
                <p class="text-xs text-red-600 mt-1" *ngIf="showError(f, 'nombre_familiar')">Nombre requerido (máx. 255)</p>
              </div>
              <div>
                <input class="border border-brand-mid w-full px-2 py-1 rounded focus:ring-2 focus:ring-brand-dark dark:bg-slate-900 dark:border-slate-600 dark:text-slate-100 dark:placeholder-slate-400"
                       [ngClass]="{'border-red-400': showError(f, 'parentesco')}"
                       name="parentesco" [(ngModel)]="form.parentesco" placeholder="Parentesco" required maxlength="100" />
                <p class="text-xs text-red-600 mt-1" *ngIf="showError(f, 'parentesco')">Parentesco requerido (máx. 100)</p>
              </div>
              <div>
                <input class="border border-brand-mid w-full px-2 py-1 rounded focus:ring-2 focus:ring-brand-dark dark:bg-slate-900 dark:border-slate-600 dark:text-slate-100 dark:placeholder-slate-400"
                       [ngClass]="{'border-red-400': invalidDate(f)}"
                       name="fecha_nacimiento" [(ngModel)]="form.fecha_nacimiento" placeholder="YYYY-MM-DD"
                       pattern="^\\d{4}-\\d{2}-\\d{2}$" />
                <p class="text-xs text-red-600 mt-1" *ngIf="invalidDate(f)">Fecha inválida (YYYY-MM-DD, no futura)</p>
              </div>
              <div class="flex justify-end">
                <button class="p-2 rounded bg-brand-accent text-white hover:opacity-90 disabled:opacity-60" title="Agregar" aria-label="Agregar"
                        [disabled]="f.invalid || invalidDate(f)">
                  <ng-icon name="heroPlus" class="w-5 h-5"></ng-icon>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  `
})
export class EmployeeFamilyModalComponent implements OnChanges {
  @Input() open = false;
  @Input() employee: Employee | null = null;
  @Output() closed = new EventEmitter<void>();
  @Output() changed = new EventEmitter<void>();

  private api = inject(ApiService);
  private toast = inject(ToastService);
  private confirmSvc = inject(ConfirmService);

  list: FamilyMember[] = [];
  form: FamilyMember = { nombre_familiar: '', parentesco: '' };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['employee'] && this.employee?.id) {
      this.load();
    }
  }

  onClose() { this.closed.emit(); }

  load() {
    if (!this.employee?.id) return;
    this.api.listRelatives(this.employee.id).subscribe({
      next: (r) => this.list = r.items,
      error: () => this.toast.error('No se pudieron cargar familiares')
    });
  }

  add() {
    if (!this.employee?.id) return;
    // Normalizar y validar campos
    this.form.nombre_familiar = (this.form.nombre_familiar || '').trim();
    this.form.parentesco = (this.form.parentesco || '').trim();

    if (!this.form.nombre_familiar || this.form.nombre_familiar.length > 255) {
      this.toast.error('Nombre del familiar requerido (máx. 255)');
      return;
    }
    if (!this.form.parentesco || this.form.parentesco.length > 100) {
      this.toast.error('Parentesco requerido (máx. 100)');
      return;
    }
    if (this.form.fecha_nacimiento && !this.isValidPastDate(this.form.fecha_nacimiento)) {
      this.toast.error('Fecha de nacimiento inválida (YYYY-MM-DD, no futura)');
      return;
    }
    this.api.addRelative(this.employee.id, this.form).subscribe({
      next: () => {
        this.toast.success('Familiar agregado');
        this.form = { nombre_familiar: '', parentesco: '' };
        this.load();
        this.changed.emit();
      },
      error: (err) => this.toast.error(err?.error?.message || 'Error al agregar familiar')
    });
  }

  async remove(r: FamilyMember) {
    if (!r.id) return;
    const ok = await this.confirmSvc.open({
      title: 'Eliminar familiar',
      message: `¿Seguro que deseas eliminar a "${r.nombre_familiar}"?`,
      confirmText: 'Eliminar'
    });
    if (!ok) return;
    this.api.deleteRelative(r.id).subscribe({
      next: () => { this.toast.success('Familiar eliminado'); this.load(); this.changed.emit(); },
      error: (err) => this.toast.error(err?.error?.message || 'Error al eliminar familiar')
    });
  }

  // Helpers de validación en template
  showError(form: any, name: string) {
    const c = form?.controls?.[name];
    return !!c && c.invalid && (c.dirty || c.touched);
  }
  invalidDate(form: any) {
    const c = form?.controls?.['fecha_nacimiento'];
    if (!c || !c.value) return false;
    if (c.errors?.['pattern']) return true;
    return !this.isValidPastDate(c.value);
  }
  private isValidPastDate(v: string): boolean {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
    const d = new Date(v + 'T00:00:00');
    if (Number.isNaN(d.getTime())) return false;
    const [y, m, day] = v.split('-').map(Number);
    if (d.getUTCFullYear() !== y || d.getUTCMonth() + 1 !== m || d.getUTCDate() !== day) return false;
    const today = new Date();
    // Comparación por fecha (ignorar hora)
    const di = new Date(Date.UTC(y, m - 1, day));
    const ti = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
    return di.getTime() <= ti.getTime();
  }
}
