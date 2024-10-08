import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Size } from '../common/size';
import { ProductSize } from '../common/product-size';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class SizeService {
  private baseUrl = environment.apiUrl +  '/api/sizes';

  constructor(private httpClient: HttpClient) {}

  getProductSizeByCode(code: string): Observable<ProductSize[]> {
    const psUrl = `${this.baseUrl}/quantity-code?code=${code}`;
    return this.httpClient.get<ProductSize[]>(psUrl).pipe(
      map(size => size.sort((a, b) => a.sizeName.localeCompare(b.sizeName)))
      );
  }

  getQuantityByProductAndSize(productId: number, sizeId: number): Observable<ProductSize> {
    const psUrl = `${this.baseUrl}/quantity?productId=${productId}&sizeId=${sizeId}`;
    return this.httpClient.get<ProductSize>(psUrl);
  }

  getSizeById(id: number): Observable<Size> {
    const sizeByIdUrl = `${this.baseUrl}/${id}`;
    return this.httpClient.get<Size>(sizeByIdUrl);
  }

  getAllSize(): Observable<Size[]> {
    return this.getSizes(this.baseUrl);
  }

  private getSizes(searchUrl: string): Observable<Size[]> {
    return this.httpClient.get<Size[]>(searchUrl);
  }
}
