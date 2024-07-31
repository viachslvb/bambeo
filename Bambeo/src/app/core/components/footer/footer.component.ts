import { Component, HostListener, OnInit } from '@angular/core';
import { UiLoadingService } from '../../services/ui-loading.service';
import { fadeInAnimation } from '../../animations';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  animations: [fadeInAnimation]
})
export class FooterComponent implements OnInit {
  isLoading: boolean = true;
  isMobile: boolean = false;

  constructor(private uiLoadingService: UiLoadingService) {
    this.uiLoadingService.isLoading.subscribe(state => {
      this.isLoading = this.isMobile ? false : state;
    });
  }

  ngOnInit(): void {
    this.updateIsMobile(window.innerWidth);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.updateIsMobile(event.target.innerWidth);
  }

  updateIsMobile(width: number): void {
    this.isMobile = width < 1024;
    if (this.isMobile) {
      this.isLoading = false;
    }
  }
}
