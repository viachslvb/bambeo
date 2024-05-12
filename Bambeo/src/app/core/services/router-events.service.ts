import { Injectable } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { BusyService } from './busy.service';

@Injectable({
  providedIn: 'root'
})
export class RouterEventsService {
  private previousPath: string = '';
  private loadingTimeout: any;

  constructor(private router: Router, private busyService: BusyService) {
    this.subscribeToRouterEvents();
  }

  private subscribeToRouterEvents(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        const currentPath = this.router.url.split('?')[0];

        if (currentPath !== this.previousPath) {
          this.previousPath = currentPath;
          this.loadingTimeout = setTimeout(() => {
            this.busyService.busy();
          }, 50);
        }
      } else if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        clearTimeout(this.loadingTimeout);
        this.busyService.idle();
      }
    });
  }
}