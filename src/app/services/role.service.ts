import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Role } from '../common/role';
import { createParamsNonArray } from '../shared/http.utils';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private baseUrl = environment.apiUrl + '/api/roles';

  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<Role[]> {
    return this.httpClient.get<Role[]>(this.baseUrl);
  }

  getAllPaginate(
    page: number,
    size: number,
    sortBy: string,
    sortDir: string,
    keyword: string,
    status: number
  ): Observable<GetResponseRole> {
    const params = createParamsNonArray({ page, size, sortBy, sortDir, keyword, status });
    return this.httpClient.get<GetResponseRole>(this.baseUrl, { params });
  }

  getByName(name: string): Observable<Role> {
    return this.httpClient.get<Role>(`${this.baseUrl}/${name}`);
  }

  deleteByIds(ids: number[]): Observable<any> {
    return this.httpClient.delete(this.baseUrl, { body: ids });
  }

  create(role: Role): Observable<Role> {
    return this.httpClient.post<Role>(this.baseUrl, role);
  }

  update(role: Role): Observable<Role> {
    return this.httpClient.put<Role>(`${this.baseUrl}/${role.id}`, role);
  }
}

interface GetResponseRole {
  data: Role[];
  page: number;
  size: number;
  totalElements: number;
}
