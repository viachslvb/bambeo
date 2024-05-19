import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ProductService } from '../product.service';
import { Location } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { BusyService } from 'src/app/core/services/busy.service';
import { ProductInfo } from 'src/app/core/models/productInfo';
import { FavoriteProductsService } from 'src/app/core/state/favorite-products.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      transition('void => *', [
        animate('0.20s ease-in')
      ]),
    ])
  ]
})
export class ProductDetailComponent implements OnInit, OnDestroy {
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
    private ts: Title
  ) { }

  ngOnInit(): void {
    this.subscribeToRouteParams();
    this.subscribeToFavorites();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    clearTimeout(this.productLoadingSpinnerTimeout);
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

  private subscribeToRouteParams(): void {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const productId = params['id'];
        if (productId && /^\d+$/.test(productId)) {
          this.loadProduct(Number(productId));
        } else {
          console.error('Invalid product ID:', productId);
          this.router.navigate(['/not-found']);
        }
      });
  }

  private loadProduct(id: number): void {
    this.productLoadingSpinnerTimeout = setTimeout(() => {
      this.busyService.busy(this.productLoadingSpinner);
    }, 70);

    this.productService.getProduct(id).subscribe({
      next: product => {
        this.product = product;
        this.isFavorite = this.favoritesService.isFavorite(product.id);
        this.ts.setTitle(`Bambeo • Promocja na ${product.name}`);
        this.clearLoadingSpinner();
      },
      error: err => {
        console.error(err);
        this.isLoadingError = true;
        this.product = undefined;
        this.clearLoadingSpinner();
      }
    });
  }

  private clearLoadingSpinner(): void {
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