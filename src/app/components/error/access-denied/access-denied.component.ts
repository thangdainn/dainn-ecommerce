import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.component.html',
  styleUrl: './access-denied.component.css',
})
export class AccessDeniedComponent {
  constructor(private router: Router, public authService: AuthService) {}

  goBack(): void {
    this.router.navigate(this.authService.isAdmin() ? ['/admin'] : ['/']);
  }

  contactSupport(): void {
    window.location.href = 'mailto:thanngit@gmail.com';
  }
}
