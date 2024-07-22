import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Brand } from '../common/brand';

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  private baseUrl = 'http://localhost:8090/api/brands';

  constructor(private httpClient: HttpClient) { }

  getBrands(): Observable<Brand[]>{
    return this.httpClient.get<Brand[]>(this.baseUrl);
  }
}
