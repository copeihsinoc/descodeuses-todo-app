import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = sessionStorage.getItem('authToken');
    
    // 🔍 如果這個 Log 出現，代表攔截器終於動了！
    console.log('🚀 [Class Interceptor] 執行中, 網址:', req.url);

    if (token) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('✅ Token 已成功放入 Header');
      return next.handle(cloned);
    }
    
    console.warn('❌ 沒找到 Token，將以匿名身份發送');
    return next.handle(req);
  }
}