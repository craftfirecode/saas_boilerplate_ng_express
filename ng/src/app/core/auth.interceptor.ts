import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // ensure cookies are sent
    let cloned = req.clone({ withCredentials: true });

    return next.handle(cloned).pipe(
      catchError((err) => {
        if (err.status === 401) {
          // try refresh once
          return from(this.auth.refresh()).pipe(
            switchMap((ok) => {
              if (!ok) return throwError(() => err);
              const retry = cloned.clone({ withCredentials: true });
              return next.handle(retry);
            })
          );
        }
        return throwError(() => err);
      })
    );
  }
}

export const authInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: AuthInterceptor,
  multi: true
};
