import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../common/order';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private paymentUrl = environment.apiUrl +  '/api/payments';

  constructor(private httpClient: HttpClient) { }

  initVNPay(order: Order): Observable<any> {
    return this.httpClient.get<any>(`${this.paymentUrl}/vnp?amount=${order.totalAmount}&orderId=${order.id}`);
  }

  initMomo(order: Order): Observable<any> {
    return this.httpClient.get<any>(`${this.paymentUrl}/momo?orderId=${order.id}`);
  }
}
