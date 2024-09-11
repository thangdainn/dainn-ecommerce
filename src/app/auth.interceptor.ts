import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const jwtToken = this.getToken();
    if (jwtToken) {
      const cloned = request.clone({
        setHeaders: {
          Authorization: `Bearer ${jwtToken}`
        }
      });

      return next.handle(cloned);
    }
    return next.handle(request);
  }

  getToken() {
    return localStorage.getItem('JWT_TOKEN');
  }
}
