import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  let authService = inject(AuthService);
  let router = inject(Router);
  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }
  if (authService.isAdmin()) {
    // Nếu user là ADMIN và đang truy cập route /admin/*
    if (state.url.startsWith('/admin')) {
      return true; // Cho phép truy cập
    } else {
      // Nếu user là ADMIN nhưng cố truy cập route khác (như /shop, /user, v.v.), chuyển hướng về /admin
      router.navigate(['/admin']);
      return false;
    }
  } else {
    router.navigate(['/access-denied']);
    return false;
  }
};
