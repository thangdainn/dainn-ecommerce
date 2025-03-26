import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import {
  BehaviorSubject,
  catchError,
  filter,
  Observable,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import { AuthService } from './services/auth.service';
import { CartService } from './services/cart.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> =
    new BehaviorSubject<string | null>(null);

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
            return throwError(() => error);
        }
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((jwt: any) => {
          const newToken = jwt.access_token;
          this.isRefreshing = false;

          this.refreshTokenSubject.next(newToken);
          this.authService.setAuthenticationStatus(newToken);

          return next.handle(this.addToken(request, newToken));
        }),
        catchError((err) => {
          this.isRefreshing = false;
          this.handleLogout();
          return throwError(() => err);
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter((token) => token !== null),
        take(1),
        switchMap((token) => {
          return next.handle(this.addToken(request, token!));
        })
      );
    }
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  private handleLogout() {
    this.cartService.clearCart();
    this.authService.logout();
    this.cartService.storage.removeItem(this.authService.token);
    this.authService.emailSubject.next('');
    this.authService.isAuthenticatedSubject.next(false);
    this.authService.userIdSubject.next(0);
    this.authService.roleSubject.next('');
    this.authService.avatarSubject.next('');
    this.authService.providerSubject.next('');
    this.router.navigate(['/login']);
  }
}
