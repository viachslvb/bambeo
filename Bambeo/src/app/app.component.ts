import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AuthService } from './core/state/auth.service';
import { ScrollService } from './core/services/scroll.service';
import { FavoriteProductsService } from './core/state/favorite-products.service';
import { RouterEventsService } from './core/services/router-events.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @ViewChild('appView', { static: true }) appView!: ElementRef;
  title = 'Bambeo';

  constructor(
    private authService: AuthService,
    private scrollService: ScrollService,
    private favoritesService: FavoriteProductsService,
    private routerEventsService: RouterEventsService,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    this.authService.initializeAuthState().subscribe();

    this.scrollService.scrollToTop$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.scrollToTop();
      });

    this.scrollService.disableScroll$
      .pipe(takeUntil(this.destroy$))
      .subscribe((disable: boolean) => {
        this.toggleNoScroll(disable);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    this.toggleNoScroll(false);
  }

  private scrollToTop() {
    this.appView.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  private toggleNoScroll(enable: boolean): void {
    if (enable) {
      this.renderer.addClass(this.appView.nativeElement, 'no-scroll');
    } else {
      this.renderer.removeClass(this.appView.nativeElement, 'no-scroll');
    }
  }
}