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
  email: string = '';
  avatar: string = 'assets/images/person_4.jpg';

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.authService.isAuthenticatedSubject.subscribe((data) => {
      this.isAuthenticated = data;
    });
    this.authService.emailSubject.subscribe((data) => {
      this.email = data;
    });
    this.authService.avatarSubject.subscribe((data) => {
      this.avatar = data;
    });
  }

  logout() {
    this.authService.logout();
    this.cartService.storage.removeItem(this.authService.token);
    this.authService.isAuthenticatedSubject.next(false);
    this.authService.emailSubject.next('');
    this.authService.userIdSubject.next(0);
    this.authService.avatarSubject.next('');
    this.authService.roleSubject.next('');
    this.cartService.clearCart();
    this.route.navigate(['/login']);
  }
}
