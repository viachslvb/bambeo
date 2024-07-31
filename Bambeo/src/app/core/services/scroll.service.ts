import { ViewportScroller } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router, Scroll } from '@angular/router';
import { filter, first, pairwise } from 'rxjs';
import { Event } from '@angular/router'
import { UiLoadingService } from './ui-loading.service';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  constructor (
    private router: Router,
    private viewportScroller: ViewportScroller,
    private uiLoadingService: UiLoadingService
  ) {
    this.viewportScroller.setHistoryScrollRestoration('manual');
    this.handleScrollOnNavigation();
  }

  private handleScrollOnNavigation(): void {
    this.router.events.pipe(
      filter((e: Event): e is Scroll => e instanceof Scroll),
      pairwise()
    ).subscribe((e: Scroll[]) => {
      const previous = e[0];
      const current = e[1];

      this.uiLoadingService.isLoading.pipe(
        first(isLoading => !isLoading)
      ).subscribe(() => {
        if (current.position) {
          requestAnimationFrame(() => {
            //this.viewportScroller.scrollToPosition(current.position as [number, number]);
            const [x, y] = current.position as [number, number];
            window.scrollTo({
              top: y,
              left: x,
              behavior: 'smooth'
            });
          });
        } else if (current.anchor) {
          this.viewportScroller.scrollToAnchor(current.anchor);
        } else {
          if (this.getBaseRoute(previous.routerEvent.urlAfterRedirects) !== this.getBaseRoute(current.routerEvent.urlAfterRedirects)) {
            this.viewportScroller.scrollToPosition([0, 0]);
          }
        }
      });
    });
  }

  private getBaseRoute(url: string): string {
    return url.split('?')[0];
  }
}