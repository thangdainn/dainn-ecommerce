import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authUrl = 'http://localhost:8090/auth';

  private readonly JWT_TOKEN = 'JWT_TOKEN';
  // private loggedUser?: string;
  isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  loggedUserSubject = new BehaviorSubject<string>('');

  constructor(private httpClient: HttpClient) {}

  login(user: {
    email: string;
    password: string;
    deviceInfo: string;
  }): Observable<GetResponseLogin> {
    return this.httpClient
      .post<GetResponseLogin>(this.authUrl + '/login', user)
      .pipe(tap((token) => this.doLoginUser(user.email, token)));
  }

  private doLoginUser(email: string, token: any) {
    this.setToken(token.access_token);
    this.loggedUserSubject.next(this.decodeJwt(token.access_token).name);
    this.isAuthenticatedSubject.next(true);
  }

  setToken(jwt: string) {
    localStorage.setItem(this.JWT_TOKEN, jwt);
  }

  getToken(): string {
    return localStorage.getItem(this.JWT_TOKEN)!;
  }

  private isTokenExpired(token: string): boolean {
    try {
      const decode = this.decodeJwt(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decode.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  me(id: number) {
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

  logout() {
    localStorage.removeItem(this.JWT_TOKEN);
    this.isAuthenticatedSubject.next(false);
  }

  isAuthenticated(): any {
    return this.isAuthenticatedSubject;
  }

  isLoggedIn() {
    // this.isAuthenticatedSubject.next(true);
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  // getUserFullName() {
  //   return this.loggedUser;
  // }
}

interface GetResponseLogin {
  token_type: string;
  access_token: any;
}
interface GetResponseInfo {
  name: string;
}
