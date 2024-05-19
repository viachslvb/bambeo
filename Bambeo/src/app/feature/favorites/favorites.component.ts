import { Component, OnInit } from '@angular/core';
import { FavoriteProduct } from 'src/app/core/models/favoriteProduct';
import { FavoriteProductsService } from 'src/app/core/state/favorite-products.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { BusyService } from 'src/app/core/services/busy.service';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      transition('void => *', [
        animate('0.20s ease-in')
      ]),
    ])
  ]
})
export class FavoritesComponent implements OnInit {
  isFavoritesLoaded = false;
  favoriteProducts: FavoriteProduct[] = [];
  promotionCount = 0;
  isLoadingError = false;

  private favoritesLoadingSpinnerTimeout: any;
  favoritesLoadingSpinner = 'favoritesLoadingSpinner';

  constructor(
    private favoritesService: FavoriteProductsService,
    private confirmationService: ConfirmationService,
    private busyService: BusyService
  ) { }

  ngOnInit(): void {
    this.loadFavoriteProducts();
  }

  loadFavoriteProducts(): void {
    this.favoritesLoadingSpinnerTimeout = setTimeout(() => {
      this.busyService.busy(this.favoritesLoadingSpinner);
    }, 70);

    this.favoritesService.getFavoriteProducts().subscribe({
      next: (response) => {
        this.favoriteProducts = response.products;
        this.promotionCount = response.promotionCount;
        this.favoritesService.setFavorites(response.products);

        this.isFavoritesLoaded = true;
        this.cleanupLoadingSpinner();
      },
      error: (err) => {
        console.error('Error loading favorites:', err);

        this.isLoadingError = true;
        this.cleanupLoadingSpinner();
      }
    });
  }

  private cleanupLoadingSpinner(): void {
    clearTimeout(this.favoritesLoadingSpinnerTimeout);
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
