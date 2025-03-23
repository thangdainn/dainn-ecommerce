import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { createParamsNonArray } from '../shared/http.utils';

@Injectable({
  providedIn: 'root',
})
export class AnalyticService {
  private baseUrl = environment.apiUrl + '/api/analytics';

  constructor(private httpClient: HttpClient) {}

  getStats(startDate: string, endDate: string): Observable<any> {
    const params = createParamsNonArray({startDate, endDate});
    return this.httpClient.get(`${this.baseUrl}/stats`, {params});
  }

  getRevenueData(startDate: string, endDate: string): Observable<any> {
    const params = createParamsNonArray({startDate, endDate});
    return this.httpClient.get(`${this.baseUrl}/revenue`, {params});
  }

  getSalesByCategory(startDate: string, endDate: string): Observable<any> {
    const params = createParamsNonArray({startDate, endDate});
    return this.httpClient.get(`${this.baseUrl}/sales-by-cate`, {params});
  }

  getTopProducts(startDate: string, endDate: string): Observable<any> {
    const params = createParamsNonArray({startDate, endDate});
    return this.httpClient.get(`${this.baseUrl}/top-products`, {params});
  }

  getRecentSales(startDate: string, endDate: string): Observable<any> {
    const params = createParamsNonArray({startDate, endDate});
    return this.httpClient.get(`${this.baseUrl}/recent-sales`, {params});
  }
}
