import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { User } from '../common/user';

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
    provider: object[],
  ): Observable<GetResponseUser> {
    let searchUrl = `${this.baseUrl}?page=${page}&size=${size}&status=${status}`;
    searchUrl += `&sortBy=${sortBy}&sortDir=${sortDir}`;
    if (keyword.length > 0) {
      searchUrl += `&keyword=${keyword}`;
    }
    if (roleIds.length > 0) {
      searchUrl += `&roleIds=${roleIds.join(',')}`;
    }
    if (provider.length > 0) {
      searchUrl += `&providers=${provider.join(',')}`;
    }
    console.log(searchUrl);

    return this.httpClient.get<GetResponseUser>(searchUrl);
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
