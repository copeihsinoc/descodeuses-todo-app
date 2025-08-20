import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = sessionStorage.getItem('authToken');
  const role = sessionStorage.getItem('authRole');


  if (!token) {
    return router.createUrlTree(['']); // if no token -> return home page
  }

  // request Role
  const requiresAdmin = route.data?.['requiresAdmin'] ?? false;
  if (requiresAdmin && role !== 'ROLE_ADMIN') {
    return router.createUrlTree(['']); // no authentication -> return home page
  }

  return true; // verified - passed
};



