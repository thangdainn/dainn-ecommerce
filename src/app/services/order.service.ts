import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Order } from '../common/order';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private orderUrl = environment.apiUrl + '/api/orders';

  constructor(private httpClient: HttpClient) {}

  placeOrder(order: Order): Observable<any> {
    return this.httpClient.post<Order>(this.orderUrl, order);
  }

  getOrders(): Observable<Order[]> {
    return this.httpClient.get<Order[]>(this.orderUrl);
  }

  getOrdersPaginate(
    page: number,
    size: number,
    sortBy: string,
    sortDir: string,
    keyword: string,
    status: string
  ): Observable<GetResponseOrder> {
    let searchUrl = `${this.orderUrl}/me?page=${page}&size=${size}`;
    searchUrl += `&sortBy=${sortBy}&sortDir=${sortDir}`;

    if (status.length == 0) {
      searchUrl += `&keyword=${keyword}`;
    } else {
      searchUrl += `&status=${status}`;
    }
    console.log(searchUrl);

    return this.httpClient.get<GetResponseOrder>(searchUrl);
  }
}

interface GetResponseOrder {
  data: Order[],
  page: number,
  size: number,
  totalElements: number,
}
