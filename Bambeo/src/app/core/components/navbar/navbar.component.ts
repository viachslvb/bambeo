import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, first, skipWhile } from 'rxjs';
import { AuthService } from 'src/app/core/state/auth.service';
import { UserService } from '../../state/user.service';
import { scrollToTop } from '../../utils';

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
    private router: Router
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

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;

    if (this.isMobileMenuOpen) {
      scrollToTop();
      this.renderer.addClass(document.body, 'no-scroll');
      this.renderer.addClass(document.body, 'body-fixed');
    } else {
      this.renderer.removeClass(document.body, 'no-scroll');
      this.renderer.removeClass(document.body, 'body-fixed');
    }
  }

  openMainPage() {
    if (this.isMobileMenuOpen) {
      this.toggleMobileMenu();
    }
  }

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