import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../common/category';
import { environment } from 'src/environments/environment.development';
import { createParamsNonArray } from '../shared/http.utils';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private baseUrl = environment.apiUrl + '/api/categories';

  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<Category[]> {
    return this.httpClient.get<Category[]>(this.baseUrl);
  }

  getAllPaginate(
    page: number,
    size: number,
    sortBy: string,
    sortDir: string,
    keyword: string,
    status: number
  ): Observable<GetResponseCate> {
    const params = createParamsNonArray({ page, size, sortBy, sortDir, keyword, status });
    return this.httpClient.get<GetResponseCate>(this.baseUrl, { params });
  }

  getById(id: number): Observable<Category> {
      return this.httpClient.get<Category>(`${this.baseUrl}/${id}`);
    }

  deleteByIds(ids: number[]): Observable<any> {
    return this.httpClient.delete(this.baseUrl, { body: ids });
  }

  create(cate: Category): Observable<Category> {
    return this.httpClient.post<Category>(this.baseUrl, cate);
  }

  update(cate: Category): Observable<Category> {
    return this.httpClient.put<Category>(`${this.baseUrl}/${cate.id}`, cate);
  }
}

interface GetResponseCate {
  data: Category[];
  page: number;
  size: number;
  totalElements: number;
}
