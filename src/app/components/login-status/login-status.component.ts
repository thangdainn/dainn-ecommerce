import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css'],
})
export class LoginStatusComponent implements OnInit {
  isAuthenticated: boolean = false;
  userName: string = '';

  constructor(private authService: AuthService, private route: Router) {}

  ngOnInit(): void {
    this.authService.isAuthenticatedSubject.subscribe((data) => {
      this.isAuthenticated = data;
      if (this.isAuthenticated) {
        this.authService.loggedUserSubject.subscribe((data) => {
          this.userName = data;
        });
      } else {
        this.handleToken();
      }
    });
  }

  private handleToken() {
    if (this.authService.isLoggedIn()) {
      const token = this.authService.getToken();
      this.authService.me(this.authService.decodeJwt(token).id).subscribe({
        next: (response) => {
          this.authService.isAuthenticatedSubject.next(true);
          this.authService.loggedUserSubject.next(response.name);
          this.authService.userIdSubject.next(response.id);
          console.log(response.id);
          
        },
      });
    }
  }

  logout() {
    this.authService.logout();
    this.authService.isAuthenticatedSubject.next(false);
    this.authService.loggedUserSubject.next('');
    this.route.navigate(['/login']);
  }
}
