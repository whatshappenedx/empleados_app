import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface Employee {
  id?: number;
  nombre: string;
  correo: string;
  cargo: string;
  fecha_ingreso?: string;
}

export interface FamilyMember {
  id?: number;
  id_empleado?: number;
  nombre_familiar: string;
  parentesco: string;
  fecha_nacimiento?: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);

  baseUrl = (window as any).API_BASE_URL || 'http://localhost:8000';
  token = (window as any).API_TOKEN || '82d54dbbe7d234489893d4afd563f6fc4779f979dfba6a04b886dbfc721344c4';

  listEmployees(page=1, limit=10, q='') {
    const url = `${this.baseUrl}/api/empleados?page=${page}&limit=${limit}&q=${encodeURIComponent(q)}`;
    return this.http.get<{items: Employee[]; page: number; total: number; limit: number}>(url);
  }

  getEmployee(id: number) {
    return this.http.get<Employee>(`${this.baseUrl}/api/empleados/${id}`);
  }

  saveEmployee(emp: Employee) {
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.token}` });
    if (emp.id) {
      return this.http.put(`${this.baseUrl}/api/empleados/${emp.id}`, emp, { headers });
    }
    return this.http.post(`${this.baseUrl}/api/empleados`, emp, { headers });
  }

  deleteEmployee(id: number) {
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.token}` });
    return this.http.delete(`${this.baseUrl}/api/empleados/${id}`, { headers });
  }

  listRelatives(employeeId: number) {
    return this.http.get<{items: FamilyMember[]}>(`${this.baseUrl}/api/empleados/${employeeId}/familiares`);
  }

  addRelative(employeeId: number, relative: FamilyMember) {
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.token}` });
    return this.http.post(`${this.baseUrl}/api/empleados/${employeeId}/familiares`, relative, { headers });
  }

  deleteRelative(id: number) {
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.token}` });
    return this.http.delete(`${this.baseUrl}/api/familiares/${id}`, { headers });
  }
}

