import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { first, skipWhile } from 'rxjs';
import { UserService } from 'src/app/account/user.service';
import { AuthService } from 'src/app/services/auth.service';

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
export class NavbarComponent implements AfterViewInit {
  @ViewChild("mobileMenu") mobileMenu!: ElementRef;

  isAuthStateLoading = true;
  isAuth: boolean = false;
  isOpenMobileMenu: boolean = false;
  isOpenUserMenu: boolean = false;
  mobileMenuHeight: string = "0px";

  constructor(public userService: UserService, private authService: AuthService,  private router: Router) {
    this.authService.authCheckCompleted$.pipe(
      skipWhile(value => value === false),
      first()
    ).subscribe((isCompleted) => {
      if (isCompleted) {
        this.isAuthStateLoading = false;
      }
    });
  }

  ngAfterViewInit(): void {
    this.defineMenuHeight();

    window.addEventListener('resize', () => {
      this.defineMenuHeight();
    });
  }

  defineMenuHeight() { 
    this.mobileMenu.nativeElement.style.height = "auto";
    this.mobileMenuHeight = this.mobileMenu.nativeElement.offsetHeight;
    this.mobileMenu.nativeElement.style.height = "0";
  }

  toggleMobileMenu() {
    this.isOpenMobileMenu = !this.isOpenMobileMenu;

    if (this.isOpenMobileMenu) {
      this.mobileMenu.nativeElement.style.height = this.mobileMenuHeight + 'px';
    }
    else {
      this.mobileMenu.nativeElement.style.height = "0px";
    }
  }

  toggleUserMenu() {
    this.isOpenUserMenu = !this.isOpenUserMenu;
  }

  logout() {
    this.userService.logout().subscribe();
    this.router.navigateByUrl('/');
  }
}
