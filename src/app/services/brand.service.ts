import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Brand } from '../common/brand';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  private baseUrl = environment.apiUrl + '/api/brands';

  constructor(private httpClient: HttpClient) { }

  getBrands(): Observable<Brand[]>{
    return this.httpClient.get<Brand[]>(this.baseUrl);
  }
}
