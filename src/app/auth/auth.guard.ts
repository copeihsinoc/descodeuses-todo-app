import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = sessionStorage.getItem('authToken');

  console.log('🔒 authGuard check token：', token);

   if (token) {
     const payload = JSON.parse(atob(token.split('.')[1]));
     if (payload.role === 'admin') {
       return true;
     }
     return true;
   }
   
   return router.createUrlTree(['']); // return page log in

  /*
  if (!token) {
    return router.createUrlTree(['']); // 沒token就回登入頁
  }

  const payload = JSON.parse(atob(token.split('.')[1]));

  // 如果路由有設定 roles，檢查是否符合
  const allowedRoles = route.data?.['roles'] as string[] | undefined;

  if (allowedRoles && !allowedRoles.includes(payload.role)) {
    // 角色不符，導回登入頁或其他頁面
    return router.createUrlTree(['']);
  }

  return true; // 有token且角色符合放行 
  */
};

