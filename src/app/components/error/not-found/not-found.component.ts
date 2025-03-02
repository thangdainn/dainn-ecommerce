import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css'
})
export class NotFoundComponent {
  invalidUrl: string = '';

  constructor(private router: Router, public authService: AuthService) {
    this.invalidUrl = this.router.routerState.snapshot.url;
  }

  goHome(): void {
    this.router.navigate(this.authService.isAdmin() ? ['/admin'] : ['/']);
  }
}
