import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    console.log('🚀 [Interceptor] Requete sortante vers:', req.url);

    // ✅ 1. 不攔截 login / register
    if (req.url.includes('/auth/login') || req.url.includes('/auth/register')) {
      return next.handle(req);
    }

    const token = sessionStorage.getItem('authToken');

    // ✅ 2. 有 token → 加 header
    if (token) {
      console.log('🔥 Token trouvé, ajout Authorization header');

      const cloned = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });

      return next.handle(cloned);
    }

    // ⚠️ 3. 沒 token（但不是 login）
    console.warn('⚠️ Aucun jeton trouvé dans le sessionStorage');
    return next.handle(req);
  }
}