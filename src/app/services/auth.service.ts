import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { CartService } from './cart.service';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authUrl = environment.apiUrl + '/aip/auth';
  private logOutUrl = environment.apiUrl + '/logout';

  private readonly JWT_TOKEN = 'JWT_TOKEN';
  isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  loggedUserSubject = new BehaviorSubject<string>('');
  userIdSubject = new BehaviorSubject<number>(0);

  constructor(
    private httpClient: HttpClient,
    private deviceService: DeviceDetectorService,
    private cartService: CartService
  ) {}

  login(user: {
    email: string;
    password: string;
    deviceInfo: string;
  }): Observable<GetResponseLogin> {
    user.deviceInfo = this.getDeviceInfo();
    return this.httpClient
      .post<GetResponseLogin>(this.authUrl + '/login', user)
      .pipe(
        tap((jwt) => {
          this.setAuthenticationStatus(jwt.access_token);
          this.cartService.getCarts(this.userIdSubject.value).subscribe();
        })
      );
  }

  loginWithGoogle(response: any): Observable<GetResponseLogin> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${response.credential}`,
    });
    return this.httpClient
      .post<GetResponseLogin>(
        this.authUrl + '/login/oauth2/google',
        { deviceInfo: this.getDeviceInfo() },
        {
          headers,
        }
      )
      .pipe(
        tap((jwt) => {
          this.setAuthenticationStatus(jwt.access_token);
          this.cartService.getCarts(this.userIdSubject.value).subscribe();
        })
      );
  }

  setAuthenticationStatus(access_token: any) {
    this.setToken(access_token);
    const decodeJwt = this.decodeJwt(access_token);
    this.loggedUserSubject.next(decodeJwt.name);
    this.userIdSubject.next(decodeJwt.id);
    this.isAuthenticatedSubject.next(true);
  }

  setToken(jwt: string) {
    localStorage.setItem(this.JWT_TOKEN, jwt);
  }

  getToken(): string {
    return localStorage.getItem(this.JWT_TOKEN)!;
  }

  isTokenExpired(token: string): boolean {
    try {
      const decode = this.decodeJwt(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decode.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  me(id: number): Observable<GetResponseInfo> {
    if (id) {
      return this.httpClient.get<GetResponseInfo>(`${this.authUrl}/${id}`);
    } else {
      throw new Error('Token is invalid or expired');
    }
  }

  decodeJwt(token: string): any {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  }

  logout(): void {
    localStorage.removeItem(this.JWT_TOKEN);
    this.isAuthenticatedSubject.next(false);
    this.userIdSubject.next(0);
    // this.cartService.clearCart();
    this.httpClient.post(this.logOutUrl, {}).subscribe();
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  refreshToken(): Observable<GetResponseLogin> {
    return this.httpClient.post<GetResponseLogin>(
      this.authUrl + '/refresh-token',
      {}
    );
  }

  private getDeviceInfo() {
    const deviceInfo = this.deviceService.getDeviceInfo();
    return `${deviceInfo.deviceType}-${deviceInfo.os}-${deviceInfo.browser}`;
  }
}

interface GetResponseLogin {
  token_type: string;
  access_token: any;
}
interface GetResponseInfo {
  id: number;
  name: string;
}
