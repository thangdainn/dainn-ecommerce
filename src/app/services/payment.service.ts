import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../common/order';
import { environment } from 'src/environments/environment.development';
import { createParamsNonArray } from '../shared/http.utils';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private paymentUrl = environment.apiUrl +  '/api/payments';

  constructor(private httpClient: HttpClient) { }

  initVNPay(order: Order): Observable<any> {
    const params = createParamsNonArray({ amount: order.totalAmount, orderId: order.id });
    return this.httpClient.get<any>(`${this.paymentUrl}/vnp`, { params });
  }

  initMomo(order: Order): Observable<any> {
    const params = createParamsNonArray({ orderId: order.id });
    return this.httpClient.get<any>(`${this.paymentUrl}/momo`, { params });
  }
}
