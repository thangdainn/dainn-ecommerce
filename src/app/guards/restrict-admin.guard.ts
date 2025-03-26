import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const restrictAdminGuard: CanActivateFn = (route, state) => {
  let authService = inject(AuthService);
  let router = inject(Router);
  if (authService.isLoggedIn() && authService.isAdmin()) {
    router.navigate(['/admin']);
    return false;
  }

  return true;
};
