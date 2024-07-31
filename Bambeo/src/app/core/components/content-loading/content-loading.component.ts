import { Directive, OnDestroy, OnInit } from '@angular/core';
import { delay, finalize, Observable, Subscription } from 'rxjs';
import { UiLoadingService } from '../../services/ui-loading.service';

@Directive()
export abstract class ContentLoadingComponent implements OnInit, OnDestroy {
  private dataSubscription: Subscription = new Subscription();
  protected uiLoadingService: UiLoadingService;

  constructor(uiLoadingService: UiLoadingService) {
    this.uiLoadingService = uiLoadingService;
  }

  abstract loadContent(): Observable<any>;

  ngOnInit() {
    this.uiLoadingService.setContentLoadingState(true);

    this.dataSubscription.add(
      this.loadContent().pipe(
        finalize(() => {
          this.uiLoadingService.setContentLoadingState(false);
          this.uiLoadingService.setComponentLoadingState(false);
        })
      ).subscribe({
        error: (error) => {
          console.error('Error loading data', error);
          this.uiLoadingService.setContentLoadingState(false);
          this.uiLoadingService.setComponentLoadingState(false);
        }
      })
    );
  }

  ngOnDestroy() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }
}