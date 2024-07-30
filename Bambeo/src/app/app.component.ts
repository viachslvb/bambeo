import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AuthService } from './core/state/auth.service';
import { ScrollService } from './core/services/scroll.service';
import { FavoriteProductsService } from './core/state/favorite-products.service';
import { isIphone, preventDoubleTapZoom, setViewportMetaTag } from './core/utils';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { BusyService } from './core/services/busy.service';
import { UiLoadingService } from './core/services/ui-loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private previousPath: string = '';
  private loadingTimeout: any;
  isHomePage: boolean = false;
  title = 'Bambeo';

  constructor(
    private authService: AuthService,
    private uiLoadingService: UiLoadingService,
    private scrollService: ScrollService,
    private favoritesService: FavoriteProductsService,
    private renderer: Renderer2,
    private router: Router,
    private busyService: BusyService
  ) { }

  ngOnInit(): void {
    if (isIphone()) {
      setViewportMetaTag();
    }

    preventDoubleTapZoom(this.renderer);

    this.authService.initializeAuthState().subscribe();

    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        const currentPath = event.url.split('?')[0];

        const url = new URL(event.url, window.location.origin);
        this.isHomePage = url.pathname === '/' || (url.pathname === '/' && this.hasAnyQueryParams(url.searchParams));

        if (currentPath !== this.previousPath) {
          this.uiLoadingService.setComponentLoadingState(true);
          this.uiLoadingService.setRouteLoadingState(true);

          this.loadingTimeout = setTimeout(() => {
            this.busyService.busy();
          }, 50);
        }
      } else if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        this.previousPath = this.router.url.split('?')[0];

        clearTimeout(this.loadingTimeout);
        this.busyService.idle();

        this.uiLoadingService.setRouteLoadingState(false);
        if (event instanceof NavigationEnd) {
          this.checkComponentType();
        }
        else {
          this.uiLoadingService.resetComponentLoadingState();
        }
      }
    });
  }



  checkComponentType() {
    const currentRoute = this.router.routerState.root.snapshot.firstChild;
    const isDynamicComponent = currentRoute?.data?.['dynamic'] ?? false;

    if (!isDynamicComponent) {
      this.uiLoadingService.resetComponentLoadingState();
    }
  }

  private hasAnyQueryParams(params: URLSearchParams): boolean {
    return [...params.keys()].length > 0;
  }
}