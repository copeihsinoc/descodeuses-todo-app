import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = sessionStorage.getItem('authToken');
    
    // 🔬 這個 Log 出現在主控台，就代表我們贏了！
    console.log('🚀 [Interceptor] 攔截器啟動！請求網址:', req.url);

    if (token) {
      const cloned = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
      return next.handle(cloned);
    }
    
    console.warn('⚠️ [Interceptor] 警告：在 sessionStorage 找不到 authToken');
    return next.handle(req);
  }
}