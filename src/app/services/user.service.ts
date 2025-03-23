import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { User } from '../common/user';
import { createParams } from '../shared/http.utils';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = environment.apiUrl + '/api/users';

  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<User[]> {
    return this.httpClient.get<User[]>(this.baseUrl);
  }

  getAllPaginate(
    page: number,
    size: number,
    sortBy: string,
    sortDir: string,
    keyword: string,
    status: number,
    roleIds: number[],
    providers: object[]
  ): Observable<GetResponseUser> {
    const params = createParams({
      page,
      size,
      sortBy,
      sortDir,
      keyword,
      status,
      roleIds,
      providers,
    });
    return this.httpClient.get<GetResponseUser>(this.baseUrl, { params });
  }

  getById(id: number): Observable<User> {
    return this.httpClient.get<User>(`${this.baseUrl}/${id}`);
  }

  deleteByIds(ids: number[]): Observable<any> {
    return this.httpClient.delete(this.baseUrl, { body: ids });
  }

  create(user: User): Observable<User> {
    return this.httpClient.post<User>(this.baseUrl, user);
  }

  update(user: User): Observable<User> {
    return this.httpClient.put<User>(`${this.baseUrl}/${user.id}`, user);
  }
}

interface GetResponseUser {
  data: User[];
  page: number;
  User: number;
  totalElements: number;
}
