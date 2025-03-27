import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authUrl = environment.apiUrl + '/api/auth';
  private logOutUrl = environment.apiUrl + '/api/logout';

  readonly token = 'token';
  isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  avatarSubject = new BehaviorSubject<string>('');
  emailSubject = new BehaviorSubject<string>('');
  userIdSubject = new BehaviorSubject<number>(0);
  roleSubject = new BehaviorSubject<string>('');
  providerSubject = new BehaviorSubject<string>('');

  constructor(private httpClient: HttpClient) {}

  register(user: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) {
    return this.httpClient.post<any>(this.authUrl + '/register', user);
  }

  forgotPassword(forgotPass: { email: string; password: string }) {
    return this.httpClient.post<any>(
      this.authUrl + '/forgot-password',
      forgotPass
    );
  }

  checkPassword(email: string, password: string): Observable<boolean> {
    return this.httpClient.post<boolean>(this.authUrl + '/check-password', {
      email,
      password,
    });
  }

  login(user: {
    email: string;
    password: string;
  }): Observable<GetResponseLogin> {
    return this.httpClient.post<GetResponseLogin>(
      this.authUrl + '/login',
      user
    );
  }

  loginWithGoogle(response: any): Observable<GetResponseLogin> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${response.credential}`,
    });
    return this.httpClient.post<GetResponseLogin>(
      this.authUrl + '/login/oauth2/google',
      {},
      {
        headers,
      }
    );
  }

  checkEmail(email: string): Observable<boolean> {
    return this.httpClient.post<boolean>(this.authUrl + '/check-email', {
      email,
    });
  }

  sendOtp(email: string): Observable<any> {
    return this.httpClient.post(this.authUrl + '/send-otp', { email });
  }

  verifyOtp(email: string, otp: string): Observable<boolean> {
    return this.httpClient.post<boolean>(this.authUrl + '/verify-otp', {
      email,
      otp,
    });
  }

  setAuthenticationStatus(access_token: any, isHandleCart = false) {
    this.setToken(access_token);
    const decode = this.decodeJwt(access_token);
    this.userIdSubject.next(decode.id);
    this.emailSubject.next(decode.email);
    this.avatarSubject.next(decode.avatar);
    this.isAuthenticatedSubject.next(true);
    this.providerSubject.next(decode.provider);
    if (isHandleCart) {
      return;
    }
    this.roleSubject.next(decode.role);
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
    return this.isAuthenticatedSubject.value;
  }

  isAdmin(): boolean {
    return this.roleSubject.value === 'ROLE_ADMIN';
  }

  refreshToken(): Observable<GetResponseLogin> {
    return this.httpClient.post<GetResponseLogin>(
      this.authUrl + '/refresh-token',
      {}
    );
  }

  getProfile(): Observable<any> {
    return this.httpClient.get(this.authUrl + '/profile');
  }
}

interface GetResponseLogin {
  token_type: string;
  access_token: any;
}
