import { ViewportScroller } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router, Scroll } from '@angular/router';
import { filter, pairwise } from 'rxjs';
import { Event } from '@angular/router'

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  constructor (
    private router: Router,
    private viewportScroller: ViewportScroller
  ) {
    this.viewportScroller.setHistoryScrollRestoration('manual');
    this.handleScrollOnNavigation();
  }

  private handleScrollOnNavigation(): void {
    this.router.events.pipe(
      // import { Event } from '@angular/router'
      filter((e: Event): e is Scroll => e instanceof Scroll),
      pairwise()
    ).subscribe((e: Scroll[]) => {
      const previous = e[0];
      const current = e[1];
      if (current.position) {
        // Backward navigation
        this.viewportScroller.scrollToPosition(current.position);
      } else if (current.anchor) {
        // Anchor navigation
        this.viewportScroller.scrollToAnchor(current.anchor);
      } else {
        // Check if routes match, or if it is only a query param change
        if (this.getBaseRoute(previous.routerEvent.urlAfterRedirects) !== this.getBaseRoute(current.routerEvent.urlAfterRedirects)) {
          // Routes don't match, this is actual forward navigation
          // Default behavior: scroll to top
          this.viewportScroller.scrollToPosition([0, 0]);
        }
      }
    });
  }

  private getBaseRoute(url: string): string {
    // return url without query params
    return url.split('?')[0];
  }
}
