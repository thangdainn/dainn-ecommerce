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
    this.authService.isAuthenticatedSubject.subscribe((data) => {
      this.isAuthenticated = data;
    });
    this.authService.loggedUserSubject.subscribe((data) => {
      this.userName = data;
    });
  }

  logout() {
    this.authService.logout();
    this.authService.isAuthenticatedSubject.next(false);
    this.authService.loggedUserSubject.next('');
    this.cartService.clearCart();
    this.route.navigate(['/login']);
  }
}
