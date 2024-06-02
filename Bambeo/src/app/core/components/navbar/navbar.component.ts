import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, first, skipWhile } from 'rxjs';
import { AuthService } from 'src/app/core/state/auth.service';
import { UserService } from '../../state/user.service';
import { ScrollService } from '../../services/scroll.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      transition('void => *', [
        animate('0.25s ease-in')
      ]),
    ])
  ]
})
export class NavbarComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  private resizeListener: () => void;

  isAuthStatusChecked = false;
  isMobileMenuOpen: boolean = false;

  constructor(
    public authService: AuthService,
    public userService: UserService,
    private renderer: Renderer2,
    private router: Router,
    private scrollService: ScrollService
  ) {
    this.resizeListener = this.renderer.listen('window', 'resize', this.onResize.bind(this));
    this.subscribeToAuthCheck();
  }

  ngOnDestroy(): void {
    if (this.resizeListener) {
      this.resizeListener();
    }

    this.destroy$.next();
    this.destroy$.complete();
  }

  private onResize() {
    const isMobile = window.innerWidth <= 640;

    if (!isMobile && this.isMobileMenuOpen) {
      this.toggleMobileMenu();
    }
  }

  private subscribeToAuthCheck() {
    this.authService.authCheckCompleted$.pipe(
      skipWhile(value => !value),
      first()
    ).subscribe((isCompleted) => {
      if (isCompleted) {
        this.isAuthStatusChecked = true;
      }
    });
  }

  scrollToTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;

    if (this.isMobileMenuOpen) {
      this.scrollToTop();
      //this.scrollService.setDisableScroll(true);
      this.renderer.addClass(document.body, 'no-scroll');
    } else {
      //this.scrollService.setDisableScroll(false);
      this.renderer.removeClass(document.body, 'no-scroll');
    }
  }

  // toggleMobileMenu() {
  //   this.isMobileMenuOpen = !this.isMobileMenuOpen;

  //   if (this.isMobileMenuOpen) {
  //     this.scrollToTop();
  //     this.renderer.addClass(document.body, 'no-scroll');
  //   } else {
  //     this.renderer.removeClass(document.body, 'no-scroll');
  //   }
  // }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigateByUrl('/');
      },
      error: (err) => {
        console.error('Logout failed:', err);
      }
    });
  }
}