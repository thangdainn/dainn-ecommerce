import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private baseUrl = '/api-tinhthanh';

  constructor(private httpClient: HttpClient) { }

  getProvinces(): Observable<GetResponseLocation> {
    return this.httpClient.get<GetResponseLocation>(`${this.baseUrl}/1/0.htm`);
  }

  getDistricts(provinceId: number): Observable<GetResponseLocation> {
    return this.httpClient.get<GetResponseLocation>(`${this.baseUrl}/2/${provinceId}.htm`);
  }

  getWards(districtId: number): Observable<GetResponseLocation> {
    return this.httpClient.get<GetResponseLocation>(`${this.baseUrl}/3/${districtId}.htm`);
  }

}

interface GetResponseLocation {
  data: any[];
}
