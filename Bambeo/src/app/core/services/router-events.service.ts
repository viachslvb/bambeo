import { Injectable } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { BusyService } from './busy.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RouterEventsService {
  private footerVisibilitySubject = new BehaviorSubject<boolean>(false);
  isFooterVisible$ = this.footerVisibilitySubject.asObservable();

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
          this.footerVisibilitySubject.next(false);
          this.previousPath = currentPath;
          this.loadingTimeout = setTimeout(() => {
            this.busyService.busy();
          }, 50);
        }
      } else if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        clearTimeout(this.loadingTimeout);
        this.busyService.idle();
        this.footerVisibilitySubject.next(true);
      }
    });
  }
}