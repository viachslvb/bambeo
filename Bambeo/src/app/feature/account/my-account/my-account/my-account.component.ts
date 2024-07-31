import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { fadeInAnimation, slideInAnimation } from 'src/app/core/animations';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css'],
  animations: [fadeInAnimation, slideInAnimation]
})
export class MyAccountComponent implements AfterViewInit {
  @ViewChild('menuContainer', { static: false }) menuContainer!: ElementRef;
  private routerSubscription!: Subscription;

  constructor(
    private router: Router
  ) {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.setInitialScrollPosition();
    });

    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateScrollPosition();
    });
  }

  setInitialScrollPosition() {
    if (window.innerWidth < 1024) {
      this.updateScrollPosition();
    }
  }

  updateScrollPosition() {
    const currentRoute = this.router.url;
    let targetElement: HTMLElement | null = null;

    switch (currentRoute) {
      case '/account/settings':
        targetElement = this.menuContainer.nativeElement.querySelector('#settings');
        break;
      case '/account':
        targetElement = this.menuContainer.nativeElement.querySelector('#account');
        break;
      case '/':
        targetElement = this.menuContainer.nativeElement.querySelector('#home');
        break;
      default:
        targetElement = this.menuContainer.nativeElement.querySelector('#account');
        break;
    }

    if (targetElement) {
      this.scrollToCenter(targetElement);
    }
  }

  scrollToCenter(item: HTMLElement) {
    const menu = this.menuContainer.nativeElement;

    if (menu && item) {
      const menuRect = menu.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();
      const scrollPosition = itemRect.left + menu.scrollLeft - menuRect.left - (menu.clientWidth / 2) + (item.clientWidth / 2);
      menu.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}
