import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = sessionStorage.getItem('authToken');
    
    // 🔬 這行 Log 一定要印出來才算成功
    console.log('🚀 [Interceptor] 類別型攔截器正在運行:', req.url);

    if (token) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('✅ [Interceptor] 已注入 Token');
      return next.handle(cloned);
    }

    console.warn('⚠️ [Interceptor] 沒找到 Token');
    return next.handle(req);
  }
}