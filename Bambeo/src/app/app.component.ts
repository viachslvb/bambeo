import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/state/auth.service';
import { ScrollService } from './core/services/scroll.service';
import { FavoriteProductsService } from './core/state/favorite-products.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Bambeo';

  constructor(
    private authService: AuthService,
    private scrollService: ScrollService,
    private favoritesService: FavoriteProductsService
  ) { }

  ngOnInit(): void {
    this.authService.initializeAuthState().subscribe();
  }
}