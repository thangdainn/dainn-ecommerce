import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Size } from '../common/size';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class SizeService {
  private baseUrl = environment.apiUrl + '/api/sizes';

  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<Size[]> {
    return this.httpClient.get<Size[]>(this.baseUrl);
  }

  getAllPaginate(
    page: number,
    size: number,
    sortBy: string,
    sortDir: string,
    keyword: string,
    status: number
  ): Observable<GetResponseSize> {
    let searchUrl = `${this.baseUrl}?page=${page}&size=${size}&status=${status}`;
    searchUrl += `&sortBy=${sortBy}&sortDir=${sortDir}`;
    if (keyword.length > 0) {
      searchUrl += `&keyword=${keyword}`;
    }
    console.log(searchUrl);

    return this.httpClient.get<GetResponseSize>(searchUrl);
  }

  getById(id: number): Observable<Size> {
    return this.httpClient.get<Size>(`${this.baseUrl}/${id}`);
  }

  deleteByIds(ids: number[]): Observable<any> {
    return this.httpClient.delete(this.baseUrl, { body: ids });
  }

  create(size: Size): Observable<Size> {
    return this.httpClient.post<Size>(this.baseUrl, size);
  }

  update(size: Size): Observable<Size> {
    return this.httpClient.put<Size>(`${this.baseUrl}/${size.id}`, size);
  }
}

interface GetResponseSize {
  data: Size[];
  page: number;
  size: number;
  totalElements: number;
}
