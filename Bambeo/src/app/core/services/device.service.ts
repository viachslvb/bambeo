import { Injectable, OnDestroy, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeviceService implements OnDestroy {
  private mobileWidth = 768;
  private isMobileSubject = new BehaviorSubject<boolean>(this.checkIsMobile());
  private renderer: Renderer2;
  private resizeListener: () => void;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.resizeListener = this.renderer.listen('window', 'resize', this.onResize.bind(this));
  }

  ngOnDestroy(): void {
    if (this.resizeListener) {
      this.resizeListener();
    }
  }

  private onResize() {
    this.isMobileSubject.next(this.checkIsMobile());
  }

  private checkIsMobile(): boolean {
    return window.innerWidth <= this.mobileWidth;
  }

  get isMobile$() {
    return this.isMobileSubject.asObservable();
  }
}
