import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    console.log('🚀 [Interceptor] Requête sortante vers:', req.url);

    // ⭕ 修正放行條件：只有登入和註冊 (sign-up) 不需要帶 Token
    if (req.url.includes('/auth/login') || req.url.includes('/auth/sign-up')) {
      console.log('🔓 Requête publique (pas de token requis) :', req.url);
      return next.handle(req);
    }

    const token = sessionStorage.getItem('authToken');

    // 2. 有 Token → 加上 Authorization Header
    if (token) {
      console.log('🔥 Token trouvé ! Ajout du header Authorization');

      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`) // 這樣寫更標準穩固
      });

      return next.handle(cloned);
    }

    // 3. 沒有 Token
    console.warn('⚠️ Aucun jeton trouvé dans le sessionStorage');
    return next.handle(req);
  }
}