import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product } from '../common/product';
import { environment } from 'src/environments/environment.development';
import { ProductSize } from '../common/product-size';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = environment.apiUrl + '/api/products';

  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(this.baseUrl);
  }

  getAllPaginate(
    page: number,
    size: number,
    sortBy: string,
    sortDir: string,
    keyword: string,
    categoryIds: number[],
    brandIds: number[],
    status: number,
    minPrice: number,
    maxPrice: number,
    isSubmitPrice: boolean,
    isStock: boolean = false
  ): Observable<GetResponseProduct> {
    let searchUrl = `${this.baseUrl}?page=${page}&size=${size}&status=${status}&isStock=${isStock}`;
    switch (sortBy) {
      case 'Latest':
        sortBy = 'createdDate';
        sortDir = 'desc';
        break;
      case 'Price: Low to High':
        sortBy = 'price';
        break;
      case 'Price: High to Low':
        sortBy = 'price';
        sortDir = 'desc';
        break;
      default:
        sortBy = 'id';
        break;
    }
    searchUrl += `&sortBy=${sortBy}&sortDir=${sortDir}`;
    if (keyword.length > 0) {
      searchUrl += `&keyword=${keyword}`;
    }
    if (categoryIds.length > 0) {
      searchUrl += `&categoryIds=${categoryIds.join(',')}`;
    }
    if (brandIds.length > 0) {
      searchUrl += `&brandIds=${brandIds.join(',')}`;
    }
    if (isSubmitPrice) {
      searchUrl += `&minPrice=${minPrice}&maxPrice=${maxPrice}`;
    }
    console.log(searchUrl);

    return this.httpClient.get<GetResponseProduct>(searchUrl);
  }

  getByCode(productCode: string): Observable<Product> {
    const productUrl = `${this.baseUrl}/${productCode}`;
    return this.httpClient.get<Product>(productUrl);
  }

  getTop10Least(): Observable<GetResponseProduct> {
    const searchUrl = `${this.baseUrl}?page=0&size=10&sortBy=createdDate&sortDir=desc`;
    return this.httpClient.get<GetResponseProduct>(searchUrl);
  }

  getStockByProductAndSize(
    productId: number,
    sizeId: number
  ): Observable<ProductSize> {
    const psUrl = `${this.baseUrl}/stock?productId=${productId}&sizeId=${sizeId}`;
    return this.httpClient.get<ProductSize>(psUrl);
  }

  getProductSizeByCode(code: string): Observable<ProductSize[]> {
    const psUrl = `${this.baseUrl}/stock/${code}`;
    return this.httpClient
      .get<ProductSize[]>(psUrl)
      .pipe(
        map((size) => size.sort((a, b) => a.sizeName.localeCompare(b.sizeName)))
      );
  }

  create(product: Product): Observable<Product> {
    return this.httpClient.post<Product>(this.baseUrl, product);
  }

  update(product: Product): Observable<Product> {
    return this.httpClient.put<Product>(`${this.baseUrl}/${product.id}`, product);
  }

  deleteByIds(ids: number[]): Observable<any> {
    return this.httpClient.delete(this.baseUrl, { body: ids });
  }

  saveAttributes(attributes: ProductSize[]): Observable<any> {
    const attrUrl = `${this.baseUrl}/attributes`;
    return this.httpClient.post(attrUrl, attributes);
  }
}

interface GetResponseProduct {
  data: Product[];
  page: number;
  size: number;
  totalElements: number;
}
