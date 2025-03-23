import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AnalyticService {
  private baseUrl = environment.apiUrl + '/api/analytics';

  constructor(private httpClient: HttpClient) {}

  getStats(startDate: string, endDate: string): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/stats?startDate=${startDate}&endDate=${endDate}`);
  }

  getRevenueData(startDate: string, endDate: string): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/revenue?startDate=${startDate}&endDate=${endDate}`);
  }

  getSalesByCategory(startDate: string, endDate: string): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/sales-by-cate?startDate=${startDate}&endDate=${endDate}`);
  }

  getTopProducts(startDate: string, endDate: string): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/top-products?startDate=${startDate}&endDate=${endDate}`);
  }

  getRecentSales(startDate: string, endDate: string): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/recent-sales`);
  }
}
