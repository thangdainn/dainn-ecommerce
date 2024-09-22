import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../common/category';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private baseUrl = environment.apiUrl +  '/api/categories';

  constructor(private httpClient: HttpClient) { }

  getCategories(): Observable<Category[]>{
    return this.httpClient.get<Category[]>(this.baseUrl);
  }
}
