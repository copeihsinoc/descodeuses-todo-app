import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = sessionStorage.getItem('authToken');

  console.log('🔒 authGuard 檢查 token：', token);

  if (token) {
    return true;
  } else {
    return router.createUrlTree(['']); // return page log in
  }
};