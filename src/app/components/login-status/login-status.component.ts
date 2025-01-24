import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css'],
})
export class LoginStatusComponent implements OnInit {
  isAuthenticated: boolean = false;
  userName: string = '';

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private route: Router
  ) {}

  ngOnInit(): void {
    const jwtToken = this.authService.getToken();
    if (jwtToken) {
      this.authService.setAuthenticationStatus(jwtToken);
    }
    this.authService.isAuthenticatedSubject.subscribe((data) => {
      this.isAuthenticated = data;
    });
    this.authService.loggedUserSubject.subscribe((data) => {
      this.userName = data;
    });
  }

  logout() {
    this.authService.logout();
    this.cartService.storage.removeItem(this.authService.token);
    this.authService.loggedUserSubject.next('');
    this.authService.isAuthenticatedSubject.next(false);
    this.authService.userIdSubject.next(0);
    this.cartService.clearCart();
    this.route.navigate(['/login']);
  }
}
