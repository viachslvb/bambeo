import { Component } from '@angular/core';
import { fadeInAnimation } from '../../animations';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  animations: [fadeInAnimation]
})
export class HeaderComponent {
  isImageLoaded: boolean = false;

  onLoad() {
    this.isImageLoaded = true;
  }
}
