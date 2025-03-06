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
    let searchUrl = `${this.baseUrl}?page=${page}&size=${size}&status=${status}`;
    searchUrl += `&sortBy=${sortBy}&sortDir=${sortDir}`;
    if (keyword.length > 0) {
      searchUrl += `&keyword=${keyword}`;
    }
    console.log(searchUrl);

    return this.httpClient.get<GetResponseRole>(searchUrl);
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
