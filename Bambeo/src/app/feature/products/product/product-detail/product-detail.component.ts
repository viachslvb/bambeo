import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ProductService } from '../product.service';
import { Location } from '@angular/common';
import { BusyService } from 'src/app/core/services/busy.service';
import { ProductInfo } from 'src/app/core/models/productInfo';
import { FavoriteProductsService } from 'src/app/core/state/favorite-products.service';
import { catchError, finalize, Observable, Subject, takeUntil, tap, throwError } from 'rxjs';
import { fadeInAnimation } from 'src/app/core/animations';
import { ContentLoadingComponent } from 'src/app/core/components/content-loading/content-loading.component';
import { UiLoadingService } from 'src/app/core/services/ui-loading.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  animations: [fadeInAnimation]
})
export class ProductDetailComponent extends ContentLoadingComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  product?: ProductInfo;
  isFavorite = false;
  isLoadingError = false;
  private productLoadingSpinnerTimeout: any;
  productLoadingSpinner = 'productLoadingSpinner';

  constructor(
    private productService: ProductService,
    private favoritesService: FavoriteProductsService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private busyService: BusyService,
    private ts: Title,
    uiLoadingService: UiLoadingService
  ) {
    super(uiLoadingService);
  }

  override ngOnInit(): void {
    super.ngOnInit();

    this.subscribeToFavorites();
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();

    clearTimeout(this.productLoadingSpinnerTimeout);
    this.destroy$.next();
    this.destroy$.complete();
  }

  private subscribeToFavorites(): void {
    this.favoritesService.favorites$
      .pipe(takeUntil(this.destroy$))
      .subscribe(favorites => {
        if (this.product) {
          this.isFavorite = favorites.includes(this.product.id);
        }
      });
  }

  loadContent(): Observable<any> {
    const productId = this.route.snapshot.paramMap.get('id');

    if (productId && /^\d+$/.test(productId)) {
      this.productLoadingSpinnerTimeout = setTimeout(() => {
        this.busyService.busy(this.productLoadingSpinner);
      }, 70);

      return this.productService.getProduct(Number(productId)).pipe(
        tap(product => {
          this.product = product;
          this.isFavorite = this.favoritesService.isFavorite(product.id);
          this.ts.setTitle(`Bambeo • Promocja na ${product.name}`);
        }),
        catchError(err => {
          console.error('Error fetching a product with ID '+productId);
          this.isLoadingError = true;
          this.product = undefined;

          return throwError(() => err);
        }),
        finalize(() => {
          this.cleanupLoadingSpinner();
        })
      );
    } else {
      this.router.navigate(['/not-found']);
      return throwError(() => new Error('Invalid product ID: '+productId));
    }
  }

  private cleanupLoadingSpinner(): void {
    clearTimeout(this.productLoadingSpinnerTimeout);
    this.busyService.idle(this.productLoadingSpinner);
  }

  toggleFavorite(): void {
    if (this.product) {
      if (this.isFavorite) {
        this.favoritesService.removeFromFavorites(this.product.id).subscribe({
          error: err => console.error(err)
        });
      } else {
        this.favoritesService.addToFavorites(this.product.id).subscribe({
          error: err => console.error(err)
        });
      }
      this.isFavorite = !this.isFavorite;
    }
  }

  goBack(): void {
    this.location.back();
  }
}