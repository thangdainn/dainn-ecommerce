import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Order } from '../common/order';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private baseUrl = environment.apiUrl + '/api/orders';

  constructor(private httpClient: HttpClient) {}

  placeOrder(order: Order): Observable<any> {
    return this.httpClient.post<Order>(this.baseUrl, order);
  }

  getAll(): Observable<Order[]> {
    return this.httpClient.get<Order[]>(this.baseUrl);
  }

  getOfMePaginate(
    page: number,
    size: number,
    sortBy: string,
    sortDir: string,
    keyword: string,
    status: string
  ): Observable<GetResponseOrder> {
    let searchUrl = `${this.baseUrl}/me?page=${page}&size=${size}`;
    searchUrl += `&sortBy=${sortBy}&sortDir=${sortDir}`;

    if (status.length == 0 && keyword.length != 0) {
      searchUrl += `&keyword=${keyword}`;
    } else if (status.length != 0){
      searchUrl += `&status=${status}`;
    }
    console.log(searchUrl);

    return this.httpClient.get<GetResponseOrder>(searchUrl);
  }

  getAllPaginate(
    page: number,
    size: number,
    sortBy: string,
    sortDir: string,
    keyword: string,
    status: string,
    fromDate: string,
    toDate: string
  ): Observable<GetResponseOrder> {
    let searchUrl = `${this.baseUrl}?page=${page}&size=${size}`;
    searchUrl += `&sortBy=${sortBy}&sortDir=${sortDir}`;

    if (keyword.length != 0) {
      searchUrl += `&keyword=${keyword}`;
    } 
    if (status.length != 0) {
      searchUrl += `&status=${status}`;
    }
    if (fromDate.length != 0) {
      searchUrl += `&fromDate=${fromDate}`;
    }
    if (toDate.length != 0) {
      searchUrl += `&toDate=${toDate}`;
    }
    console.log(searchUrl);

    return this.httpClient.get<GetResponseOrder>(searchUrl);
  }

  getById(id: number): Observable<Order> {
    return this.httpClient.get<Order>(`${this.baseUrl}/${id}`);
  }

  deleteByIds(ids: number[]): Observable<any> {
    return this.httpClient.delete(this.baseUrl, { body: ids });
  }

  create(size: Order): Observable<Order> {
    return this.httpClient.post<Order>(this.baseUrl, size);
  }

  update(size: Order): Observable<Order> {
    return this.httpClient.put<Order>(`${this.baseUrl}/${size.id}`, size);
  }
}

interface GetResponseOrder {
  data: Order[];
  page: number;
  size: number;
  totalElements: number;
}
