import { Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, Output, Renderer2, ViewChild } from '@angular/core';
import { User } from 'src/app/core/models/user';

@Component({
  selector: 'app-profile-menu-dropdown',
  templateUrl: './profile-menu-dropdown.component.html',
  styleUrls: ['./profile-menu-dropdown.component.css']
})
export class ProfileMenuDropdownComponent {
  @Input() user!: User;
  @Output() logout = new EventEmitter<void>();
  @ViewChild('profileMenuButton') profileMenuButton!: ElementRef;
  @ViewChild('profileMenuDropdown') profileMenuDropdown!: ElementRef;

  isDropdownMenuVisible: boolean = false;

  constructor() { }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (this.isDropdownMenuVisible) {
      this.toggle();
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (this.isDropdownMenuVisible) {
      if (!this.profileMenuButton.nativeElement.contains(event.target)
        && !this.profileMenuDropdown.nativeElement.contains(event.target)) {
        this.isDropdownMenuVisible = false;
      }
    }
  }

  toggle() {
    this.isDropdownMenuVisible = !this.isDropdownMenuVisible;
  }

  onLogout() {
    this.logout.emit();
  }
}
