import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = sessionStorage.getItem('authToken');
  const role = sessionStorage.getItem('authRole');

  console.log('🔒 authGuard check token：', token);
  console.log('🔒 authGuard check role：', role);

  if (!token) {
    return router.createUrlTree(['']); // 沒 token，回登入頁
  }

  // 如果路由有要求角色
  const requiresAdmin = route.data?.['requiresAdmin'] ?? false;
  if (requiresAdmin && role !== 'ROLE_ADMIN') {
    return router.createUrlTree(['']); // 沒有權限，回登入頁
  }

  return true; // 通過驗證
};
  /*
   if (token) {
     const payload = JSON.parse(atob(token.split('.')[1]));
     if (payload.role === 'admin') {
       return true;
     }
     return true;
   }
   
   return router.createUrlTree(['']); // return page log in


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


