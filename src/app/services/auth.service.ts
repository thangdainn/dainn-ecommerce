import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authUrl = environment.apiUrl + '/api/auth';
  private logOutUrl = environment.apiUrl + '/logout';

  readonly token = 'token';
  isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  loggedUserSubject = new BehaviorSubject<string>('');
  userIdSubject = new BehaviorSubject<number>(0);
  rolesSubject = new BehaviorSubject<string[]>([]);

  constructor(
    private httpClient: HttpClient,
    private deviceService: DeviceDetectorService
  ) {}

  register(user: { name: string; email: string; password: string }) {
    return this.httpClient.post<GetResponseLogin>(
      this.authUrl + '/register',
      user
    );
  }

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
        })
      );
  }

  getMyInfo(): Observable<GetResponseInfo> {
    return this.httpClient.get<GetResponseInfo>(this.authUrl + '/me');
  }

  setAuthenticationStatus(access_token: any) {
    this.setToken(access_token);
    this.getMyInfo().subscribe({
      next: (response) => {
        this.loggedUserSubject.next(response.name);
        this.userIdSubject.next(response.id);
        this.isAuthenticatedSubject.next(true);
        this.rolesSubject.next(response.rolesName);
      },
      error: () => {
        this.isAuthenticatedSubject.next(false);
      },
    });
  }

  setToken(jwt: string) {
    localStorage.setItem(this.token, jwt);
  }

  getToken(): string {
    return localStorage.getItem(this.token)!;
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

  decodeJwt(token: string): any {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  }

  logout(): void {
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
  email: string;
  rolesName: string[];
}
