import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from 'src/app/core/models/user';

@Component({
  selector: 'app-mobile-menu',
  templateUrl: './mobile-menu.component.html',
  styleUrls: ['./mobile-menu.component.css'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      transition('void => *', [
        animate('0.15s ease-in')
      ]),
    ])
  ]
})
export class MobileMenuComponent {
  @Input() isOpen: boolean = false;
  @Input() isLoggedIn: boolean = false;
  @Input() user?: User | null;
  @Output() closeMenu = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  onCloseMenu() {
    this.closeMenu.emit();
  }

  onLogout() {
    this.logout.emit();
  }
}