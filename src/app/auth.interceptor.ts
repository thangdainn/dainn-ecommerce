import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from './services/auth.service';
import { CartService } from './services/cart.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;

  constructor(private authService: AuthService, private cartService: CartService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    request = request.clone({
      withCredentials: true,
    });
    const jwtToken = this.authService.getToken();

    if (jwtToken) {
      if (
        !this.authService.isTokenExpired(jwtToken) &&
        !this.authService.isAuthenticatedSubject.value
      ) {
        this.authService.setAuthenticationStatus(jwtToken);
      }
      request = this.addToken(request, jwtToken);
    }
    return next.handle(request).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(request, next);
        } else {
          return throwError(() => error);
        }
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;

      return this.authService.refreshToken().pipe(
        switchMap((jwt: any) => {
          this.isRefreshing = false;
          
          const newToken = jwt.access_token;
          this.authService.setAuthenticationStatus(newToken);

          return next.handle(this.addToken(request, newToken));
        }),
        catchError((err) => {
          this.isRefreshing = false;
          this.cartService.clearCart();
          this.authService.logout();
          return throwError(() => err);
        })
      );
    }
    return next.handle(request);
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
