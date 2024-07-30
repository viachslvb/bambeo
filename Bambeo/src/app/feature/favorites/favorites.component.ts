import { Component, OnInit } from '@angular/core';
import { FavoriteProduct } from 'src/app/core/models/favoriteProduct';
import { FavoriteProductsService } from 'src/app/core/state/favorite-products.service';
import { BusyService } from 'src/app/core/services/busy.service';
import { ConfirmationService } from 'primeng/api';
import { fadeInAnimation } from 'src/app/core/animations';
import { ContentLoadingComponent } from 'src/app/core/components/content-loading/content-loading.component';
import { UiLoadingService } from 'src/app/core/services/ui-loading.service';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css'],
  animations: [fadeInAnimation]
})
export class FavoritesComponent extends ContentLoadingComponent implements OnInit {
  isFavoritesLoaded = false;
  favoriteProducts: FavoriteProduct[] = [];
  promotionCount = 0;
  isLoadingError = false;

  private loadingTimeout: any;
  favoritesLoadingSpinner = 'favoritesLoadingSpinner';

  constructor(
    private favoritesService: FavoriteProductsService,
    private confirmationService: ConfirmationService,
    private busyService: BusyService,
    uiLoadingService: UiLoadingService
  ) {
    super(uiLoadingService);
  }

  loadContent(): Observable<any> {
    this.loadingTimeout = setTimeout(() => {
      this.busyService.busy(this.favoritesLoadingSpinner);
    }, 70);

    return this.favoritesService.getFavoriteProducts().pipe(
      tap(response => {
        this.favoriteProducts = response.products;
        this.promotionCount = response.promotionCount;
        this.favoritesService.setFavorites(response.products);
        this.isFavoritesLoaded = true;
      }),
      catchError(err => {
        console.error('Error fetching favorite products', err);
        this.isLoadingError = true;

        return throwError(() => err);
      }),
      finalize(() => {
        this.cleanupLoadingSpinner();
      })
    );
  }

  private cleanupLoadingSpinner(): void {
    clearTimeout(this.loadingTimeout);
    this.busyService.idle(this.favoritesLoadingSpinner);
  }

  confirmRemovingFromFavorites(event: Event, productId: number) {
    event.stopPropagation();
    event.preventDefault();

    this.confirmationService.confirm({
      message: 'Czy jesteś pewien, że chcesz usunąć ten produkt z ulubionych?',
      header: 'Potwierdzenie usunięcia',
      icon: 'pi pi-info-circle',
      acceptLabel: 'Tak',
      rejectLabel: 'Nie',
      defaultFocus: 'reject',
      accept: () => {
        this.removeFromFavorites(productId);
      }
    });
  }

  removeFromFavorites(productId: number): void {
    this.favoritesService.removeFromFavorites(productId).subscribe(() => {
      const productIndex = this.favoriteProducts.findIndex(product => product.productId === productId);
      if (productIndex > -1) {
        const [removedProduct] = this.favoriteProducts.splice(productIndex, 1);
        if (removedProduct?.hasPromotion) {
          this.promotionCount--;
        }
      }
    });
  }
}
