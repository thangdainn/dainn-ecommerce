import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Role } from '../common/role';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private baseUrl = environment.apiUrl + '/api/roles';

  constructor(private httpClient: HttpClient) {}

  getAllRoles(): Observable<Role[]> {
    return this.httpClient.get<Role[]>(this.baseUrl);
  }

  getRoleByName(name: string): Observable<Role> {
    return this.httpClient.get<Role>(`${this.baseUrl}/${name}`);
  }

  deleteRoles(ids: number[]): Observable<any> {
    return this.httpClient.delete(this.baseUrl, { body: ids });
  }

  createRole(role: Role): Observable<Role> {
    return this.httpClient.post<Role>(this.baseUrl, role);
  }

  updateRole(role: Role): Observable<Role> {
    return this.httpClient.put<Role>(`${this.baseUrl}/${role.id}`, role);
  }
}
