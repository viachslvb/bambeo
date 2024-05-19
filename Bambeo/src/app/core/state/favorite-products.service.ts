import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, catchError, delay, map, switchMap, takeUntil, tap, throwError } from 'rxjs';
import { ApiService } from '../services/api.service';
import { AuthService } from './auth.service';
import { FavoriteProduct } from '../models/favoriteProduct';
import { ApiErrorCode } from '../models/api/apiErrorCode';
import { FavoriteProductsResponse } from '../models/api/responses/favoriteProductsResponse';

@Injectable({
  providedIn: 'root'
})
export class FavoriteProductsService implements OnDestroy {
  private destroy$ = new Subject<void>();
  private favoritesSubject = new BehaviorSubject<number[]>([]);
  favorites$ = this.favoritesSubject.asObservable();

  constructor(private apiService: ApiService, private authService: AuthService) {
    this.subscribeToAuthChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private subscribeToAuthChanges() {
    this.authService.isAuthenticated$.pipe(
      switchMap(isAuthenticated => {
        if (isAuthenticated) {
          return this.loadFavorites().pipe(
            catchError(() => {
              this.favoritesSubject.next([]);
              return [];
            })
          );
        } else {
          this.favoritesSubject.next([]);
          return [];
        }
      }),
      takeUntil(this.destroy$)
    ).subscribe(favorites => {
      this.favoritesSubject.next(favorites);
    });
  }

  private loadFavorites(): Observable<number[]> {
    return this.getFavoriteProducts().pipe(
      map(favoriteProducts => favoriteProducts.products.map(product => product.productId))
    );
  }

  getFavoriteProducts(): Observable<FavoriteProductsResponse> {
    const endpoint = 'favorites';

    return this.apiService.get<FavoriteProductsResponse>(endpoint);
  }

  addToFavorites(productId: number): Observable<void> {
    const endpoint = `favorites/${productId}`;

    return this.apiService.post<void>(endpoint, {}).pipe(
      tap(() => {
        const currentFavorites = this.favoritesSubject.value;
        this.favoritesSubject.next([...currentFavorites, productId]);
      }),
      catchError(error => {
        if (error.type === ApiErrorCode.ProductAlreadyFavorited) {
          const currentFavorites = this.favoritesSubject.value;
          if (!currentFavorites.includes(productId)) {
            this.favoritesSubject.next([...currentFavorites, productId]);
          }
        }
        return throwError(() => new Error(error.message));
      })
    );
  }

  removeFromFavorites(productId: number): Observable<void> {
    const endpoint = `favorites/${productId}`;

    return this.apiService.delete<void>(endpoint).pipe(
      tap(() => {
        const currentFavorites = this.favoritesSubject.value;
        this.favoritesSubject.next(currentFavorites.filter(id => id !== productId));
      }),
      catchError(error => {
        if (error.type === ApiErrorCode.ProductNotFavorited) {
          const currentFavorites = this.favoritesSubject.value;
          if (currentFavorites.includes(productId)) {
            this.favoritesSubject.next(currentFavorites.filter(id => id !== productId));
          }
        }
        return throwError(() => new Error(error.message));
      })
    );
  }

  setFavorites(products: FavoriteProduct[]) {
    const favoriteProducts = products.map(product => product.productId);
    this.favoritesSubject.next(favoriteProducts);
  }

  isFavorite(productId: number): boolean {
    return this.favoritesSubject.value.includes(productId);
  }
}
