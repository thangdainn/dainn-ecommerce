import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Category } from '../common/category';
import { Size } from '../common/size';
import { ProductSize } from '../common/product-size';

@Injectable({
  providedIn: 'root',
})
export class SizeService {
  private baseUrl = 'http://localhost:8090/api/sizes';

  constructor(private httpClient: HttpClient) {}

  getProductSizeByCode(code: string): Observable<ProductSize[]> {
    const psUrl = `${this.baseUrl}/product-code?code=${code}`;
    return this.httpClient.get<ProductSize[]>(psUrl).pipe(
      map(size => size.sort((a, b) => a.sizeName.localeCompare(b.sizeName)))
      );
  }

  getSizeById(id: number): Observable<Size> {
    const sizeByIdUrl = `${this.baseUrl}/${id}`;
    return this.httpClient.get<Size>(sizeByIdUrl);
  }

  getAllSize(): Observable<Size[]> {
    return this.getSizes(this.baseUrl);
  }

  private getSizes(searchUrl: String): Observable<Size[]> {
    return this.httpClient.get<Size[]>(this.baseUrl);
  }
}
