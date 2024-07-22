import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product } from '../common/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  

  private baseUrl = 'http://localhost:8090/api/products';

  constructor(private httpClient: HttpClient) { }

  getAllProduct(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(this.baseUrl);
  }


  getProductsPaginate(page: number, size: number, sortBy: string, sortDir: string,
                      keyword: string, categoryIds: number[], brandIds: number[],
                      minPrice: number, maxPrice: number, isSubmitPrice: boolean): Observable<GetResponseProduct> {
    let searchUrl = `${this.baseUrl}?page=${page}&size=${size}`;
    switch (sortBy) {
      case 'Latest':
        sortBy = "createdDate";
        sortDir = "desc";
        break;
      case 'Price: Low to High':
        sortBy = "price";
        break;
      case 'Price: High to Low':
        sortBy = "price";
        sortDir = "desc";
        break;
      default:
        sortBy = "id";
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

  getProductByCode(productCode: string): Observable<Product> {
    const productUrl = `${this.baseUrl}/${productCode}`;
    return this.httpClient.get<Product>(productUrl);
  }

  getTop10LeastProducts() {
    const searchUrl = `${this.baseUrl}?page=0&size=10&sortBy=createdDate&sortDir=desc`;
    return this.httpClient.get<GetResponseProduct>(searchUrl);
  
  }
}

interface GetResponseProduct {
  data: Product[],
  page: number,
  size: number,
  totalElements: number,
}
