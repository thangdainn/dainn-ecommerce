import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Brand } from '../common/brand';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class BrandService {
  private baseUrl = environment.apiUrl + '/api/brands';

  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<Brand[]> {
    return this.httpClient.get<Brand[]>(this.baseUrl);
  }

  getAllPaginate(
    page: number,
    size: number,
    sortBy: string,
    sortDir: string,
    keyword: string,
    status: number
  ): Observable<GetResponseBrand> {
    let searchUrl = `${this.baseUrl}?page=${page}&size=${size}&status=${status}`;
    searchUrl += `&sortBy=${sortBy}&sortDir=${sortDir}`;
    if (keyword.length > 0) {
      searchUrl += `&keyword=${keyword}`;
    }
    console.log(searchUrl);

    return this.httpClient.get<GetResponseBrand>(searchUrl);
  }

  getById(id: number): Observable<Brand> {
    return this.httpClient.get<Brand>(`${this.baseUrl}/${id}`);
  }

  deleteByIds(ids: number[]): Observable<any> {
    return this.httpClient.delete(this.baseUrl, { body: ids });
  }

  create(brand: Brand): Observable<Brand> {
    return this.httpClient.post<Brand>(this.baseUrl, brand);
  }

  update(brand: Brand): Observable<Brand> {
    return this.httpClient.put<Brand>(`${this.baseUrl}/${brand.id}`, brand);
  }
}

interface GetResponseBrand {
  data: Brand[];
  page: number;
  size: number;
  totalElements: number;
}
