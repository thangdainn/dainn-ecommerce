import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authUrl = 'http://localhost:8090/api/auth';
  private logOutUrl = 'http://localhost:8090/logout';

  private readonly JWT_TOKEN = 'JWT_TOKEN';
  isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  loggedUserSubject = new BehaviorSubject<string>('');
  userIdSubject = new BehaviorSubject<number>(0);

  constructor(
    private httpClient: HttpClient,
    private deviceService: DeviceDetectorService
  ) {}

  login(user: {
    email: string;
    password: string;
    deviceInfo: string;
  }): Observable<GetResponseLogin> {
    user.deviceInfo = this.getDeviceInfo();
    return this.httpClient
      .post<GetResponseLogin>(this.authUrl + '/login', user, {
        withCredentials: true,
      })
      .pipe(tap((jwt) => this.setAuthenticationStatus(jwt.access_token)));
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
    this.httpClient
      .post(this.logOutUrl, null, {
        withCredentials: true,
      })
      .subscribe();
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  refreshToken(): Observable<GetResponseLogin> {
    return this.httpClient.post<GetResponseLogin>(
      this.authUrl + '/refresh-token',
      {
        withCredentials: true,
      }
    );
  }

  loginWithGoogle(response: any): Observable<GetResponseLogin> {
    return this.httpClient
      .post<GetResponseLogin>(
        this.authUrl + '/google',
        { token: response.credential, deviceInfo: this.getDeviceInfo() },
        {
          withCredentials: true,
        }
      )
      .pipe(tap((token) => this.setAuthenticationStatus(token.access_token)));
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
