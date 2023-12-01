import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { AccountService } from 'src/app/account/account.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements AfterViewInit {
  @ViewChild("mobileMenu") mobileMenu!: ElementRef;

  isAuth: boolean = false;
  isOpenMobileMenu: boolean = false;
  isOpenUserMenu: boolean = false;
  mobileMenuHeight: string = "0px";

  constructor(public accountService: AccountService) { }

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
}
