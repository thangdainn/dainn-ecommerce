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
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    request = request.clone({
      withCredentials: true,
    });
    const jwtToken = this.authService.getToken();

    if (jwtToken) {
      request = this.addToken(request, jwtToken);
    }
    return next.handle(request).pipe(
      catchError((error) => {
        switch (error.status) {
          case 401:
            return this.handle401Error(request, next);
          case 403:
            this.router.navigate(['/access-denied']);
            return throwError(() => error);
            // break;
          default:
            this.router.navigate(['/login']);
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
          this.cartService.storage.removeItem(this.authService.token);
          this.authService.loggedUserSubject.next('');
          this.authService.isAuthenticatedSubject.next(false);
          this.authService.userIdSubject.next(0);
          this.router.navigate(['/login']);
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
