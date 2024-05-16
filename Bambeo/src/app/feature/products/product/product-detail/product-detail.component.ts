import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Product } from 'src/app/core/models/product';
import { ProductService } from '../product.service';
import { Location } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { BusyService } from 'src/app/core/services/busy.service';
import { ProductInfo } from 'src/app/core/models/productInfo';

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
export class ProductDetailComponent implements OnInit {
  product?: ProductInfo;
  isFavorite: boolean = false;
  isLoadingError = false;

  private productLoadingSpinnerTimeout: any;
  productLoadingSpinner = 'productLoadingSpinner';

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private busyService: BusyService,
    private ts: Title
  ) { }

  ngOnInit(): void {
    this.subscribeToQueryParam();
  }

  private subscribeToQueryParam() {
    this.route.params.subscribe(params => {
      const productId = params['id'];

      if (productId && /^\d+$/.test(productId)) {
        const id = Number(productId);
        this.fetchProduct(id);
      } else {
        console.error('Invalid product ID:', productId);
        this.router.navigate(['/not-found']);
      }
    });
  }

  fetchProduct(id: number) {
    if (id) {
      this.productLoadingSpinnerTimeout = setTimeout(() => {
        this.busyService.busy(this.productLoadingSpinner);
      }, 70);

      this.productService.getProduct(id).subscribe({
        next: product => {
          this.product = product;
          this.ts.setTitle(`Bambeo • Promocja na ${product.name}`);

          clearTimeout(this.productLoadingSpinnerTimeout);
          this.busyService.idle(this.productLoadingSpinner);
        },
        error: err => {
          console.log(err);

          this.isLoadingError = true;
          this.product = undefined;
          clearTimeout(this.productLoadingSpinnerTimeout);
          this.busyService.idle(this.productLoadingSpinner);
        }
      });
    }
  }

  goBack() {
    this.location.back();
  }

  addToFavorites() {
    this.isFavorite = !this.isFavorite;
  }
}
