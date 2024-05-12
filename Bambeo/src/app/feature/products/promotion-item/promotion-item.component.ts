import { Component, Input } from '@angular/core';
import { Promotion } from 'src/app/core/models/promotion';

@Component({
  selector: 'app-promotion-item',
  templateUrl: './promotion-item.component.html',
  styleUrls: ['./promotion-item.component.css']
})
export class PromotionItemComponent {
  @Input() promotion!: Promotion;

  
}
