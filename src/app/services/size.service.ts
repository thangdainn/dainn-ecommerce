import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Size } from '../common/size';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class SizeService {
  private baseUrl = environment.apiUrl +  '/api/sizes';

  constructor(private httpClient: HttpClient) {}

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
