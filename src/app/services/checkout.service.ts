import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from '../common/order';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private purchaseUrl = environment.apiUrl +  '/api/checkout';

  constructor(private httpClient: HttpClient) { }

  placeOrder(order: Order): Observable<any> {
    return this.httpClient.post<Order>(this.purchaseUrl, order);
  }

  initVNPay(order: Order): Observable<any> {
    return this.httpClient.post<Order>(this.purchaseUrl + '/vnpay', order);
  }
}
