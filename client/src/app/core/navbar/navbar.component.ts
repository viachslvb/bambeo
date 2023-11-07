import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, AfterViewInit {
  @ViewChild("mobileMenu") mobileMenu!: ElementRef;

  isAuth: boolean = false;
  isOpenMobileMenu: boolean = false;
  isOpenUserMenu: boolean = false;
  mobileMenuHeight: string = "0px";

  ngOnInit(): void {
    initFlowbite();
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
}
