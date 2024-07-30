import { Component } from '@angular/core';
import { UiLoadingService } from '../../services/ui-loading.service';
import { fadeInAnimation } from '../../animations';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  animations: [fadeInAnimation]
})
export class FooterComponent {
  isLoading: boolean = true;

  constructor(private uiLoadingService: UiLoadingService) {
    this.uiLoadingService.isLoading.subscribe(state => {
      this.isLoading = state;
    });
  }
}
