import { Routes } from '@angular/router';
import { EmployeesListComponent } from './employees/employees-list.component';
import { EmployeeFormComponent } from './employees/employee-form.component';

export const routes: Routes = [
  { path: '', component: EmployeesListComponent },
  { path: 'nuevo', component: EmployeeFormComponent },
  { path: 'editar/:id', component: EmployeeFormComponent },
  { path: '**', redirectTo: '' }
];

