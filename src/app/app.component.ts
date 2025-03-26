import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'angular-ecommerce';
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    const jwtToken = this.authService.getToken();
    if (jwtToken) {
      this.authService.setAuthenticationStatus(jwtToken);
    }
    this.authService.roleSubject.subscribe((data) => {
      if (data === 'ROLE_USER') {
        this.router.navigate(['/']);
      } else {
        this.router.navigate(['/admin']);
      }
    });
  }

  isAdminRoute(): boolean {
    return this.router.url.startsWith('/admin');
  }
}
