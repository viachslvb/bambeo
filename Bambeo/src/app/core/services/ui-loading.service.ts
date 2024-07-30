import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UiLoadingService {
  private componentLoadingState = new BehaviorSubject<boolean>(false);
  private routeLoadingState = new BehaviorSubject<boolean>(false);
  private contentLoadingState = new BehaviorSubject<boolean>(false);

  public isLoading = combineLatest([
    this.routeLoadingState,
    this.componentLoadingState,
    this.contentLoadingState
  ]).pipe(
    map(([routeLoading, componentLoading, contentLoading]) =>
      routeLoading || componentLoading || contentLoading
    )
  );

  setRouteLoadingState(state: boolean) {
    this.routeLoadingState.next(state);
  }

  setComponentLoadingState(state: boolean) {
    this.componentLoadingState.next(state);
  }

  setContentLoadingState(state: boolean) {
    this.contentLoadingState.next(state);
  }

  resetComponentLoadingState() {
    this.componentLoadingState.next(false);
    this.contentLoadingState.next(false);
  }
}
