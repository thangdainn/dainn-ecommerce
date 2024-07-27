import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../common/order';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private paymentUrl = 'http://localhost:8090/api/payment';

  constructor(private httpClient: HttpClient) { }

  initVNPay(order: Order): Observable<any> {
    return this.httpClient.get<any>(`${this.paymentUrl}/vnp?amount=${order.totalAmount}&orderId=${order.id}`);
  }
}
