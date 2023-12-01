import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, delay } from 'rxjs';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor() { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Use delay for loading promotions/categories/products/stores only
    if (request.url.includes("promotions") || request.url.includes("categories") || request.url.includes("products") || request.url.includes("stores")) {
      return next.handle(request).pipe(delay(100));
    }

    return next.handle(request).pipe(delay(5000));
  }
}
