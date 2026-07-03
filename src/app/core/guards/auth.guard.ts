import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const cookie = inject(CookieService);
  const token = cookie.get('user');

  if (token) {
    return true;
  }

  router.navigate(['/']);
  return false;
};
