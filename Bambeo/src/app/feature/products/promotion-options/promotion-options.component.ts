import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { PromotionService } from '../promotion.service';
import { Subject, map, takeUntil } from 'rxjs';

@Component({
  selector: 'app-promotion-options',
  templateUrl: './promotion-options.component.html',
  styleUrls: ['./promotion-options.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PromotionOptionsComponent implements AfterViewInit, OnDestroy {
  private destroy$ = new Subject<void>();
  includeUpcomingPromotions: boolean = false;
  
  constructor(
    private promotionService: PromotionService,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    this.subscribeToFilters();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private subscribeToFilters(): void {
    this.promotionService.getFilters()
      .pipe(
        map((filters) => filters.includeUpcomingPromotions),
        takeUntil(this.destroy$)
      )
      .subscribe((filters) => {
        this.updateOptions(filters);
        this.cdr.detectChanges();
    });
  }

  private updateOptions(includeUpcomingPromotions: boolean) {
    this.includeUpcomingPromotions = includeUpcomingPromotions;
  }

  onShowUpcomingPromotions() {
    this.includeUpcomingPromotions = !this.includeUpcomingPromotions;
    this.promotionService.updateFilterPart({ pageIndex: 1, includeUpcomingPromotions: this.includeUpcomingPromotions });
  }
}