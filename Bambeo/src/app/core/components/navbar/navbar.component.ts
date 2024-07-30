import { Component, HostListener, OnDestroy, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, first, skipWhile } from 'rxjs';
import { AuthService } from 'src/app/core/state/auth.service';
import { UserService } from '../../state/user.service';
import { scrollToTop } from '../../utils';
import { fadeInAnimation, fadeInOutAnimation } from '../../animations';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  animations: [fadeInAnimation, fadeInOutAnimation]
})
export class NavbarComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  isAuthStatusChecked = false;
  isMobileMenuOpen: boolean = false;

  constructor(
    public authService: AuthService,
    public userService: UserService,
    private renderer: Renderer2,
    private router: Router
  ) {
    this.subscribeToAuthCheck();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    const isMobile = event.target.innerWidth <= 640;

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