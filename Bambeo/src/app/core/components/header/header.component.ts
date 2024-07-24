import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      transition('void => *', [
        animate('0.20s ease-in')
      ]),
    ])
  ]
})
export class HeaderComponent implements OnDestroy {
  private routerSubscription: Subscription;

  isHomePage: boolean = true;
  isChecked: boolean = false;
  isImageLoaded: boolean = false;

  constructor(private router: Router) {
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {

        const url = new URL(this.router.url, window.location.origin);
        this.isHomePage = url.pathname === '/' || url.pathname === '/' && this.hasAnyQueryParams(url.searchParams);
        this.isChecked = true;
      }
    });
  }

  private hasAnyQueryParams(params: URLSearchParams): boolean {
    return [...params.keys()].length > 0;
  }

  onLoad() {
    this.isImageLoaded = true;
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}
