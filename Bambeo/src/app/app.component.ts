import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AuthService } from './core/state/auth.service';
import { ScrollService } from './core/services/scroll.service';
import { FavoriteProductsService } from './core/state/favorite-products.service';
import { RouterEventsService } from './core/services/router-events.service';
import { isIphone, preventDoubleTapZoom, setViewportMetaTag } from './core/utils';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })),
      transition('void => *', [
        animate('0.10s ease-in')
      ]),
      transition('* => void', [
        animate('0.10s ease-out')
      ])
    ])
  ]
})
export class AppComponent implements OnInit {
  @ViewChild('appView', { static: true }) appView!: ElementRef;
  title = 'Bambeo';
  isFooterVisible = false;

  constructor(
    private authService: AuthService,
    private scrollService: ScrollService,
    private favoritesService: FavoriteProductsService,
    private routerEventsService: RouterEventsService,
    private renderer: Renderer2,
  ) { }

  ngOnInit(): void {
    if (isIphone()) {
      setViewportMetaTag();
    }
    preventDoubleTapZoom(this.renderer);

    this.authService.initializeAuthState().subscribe();
    this.routerEventsService.isFooterVisible$.subscribe(
      value => {
        this.isFooterVisible = value;
      }
    );
  }
}