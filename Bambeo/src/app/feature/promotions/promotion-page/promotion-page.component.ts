import { Component, OnInit } from '@angular/core';
import { PromotionsService } from '../promotions.service';
import { ActivatedRoute } from '@angular/router';
import { Promotion } from 'src/app/core/models/promotion';
import { BreadcrumbService } from 'xng-breadcrumb';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-promotion-page',
  templateUrl: './promotion-page.component.html',
  styleUrls: ['./promotion-page.component.css']
})
export class PromotionPageComponent implements OnInit {
  promotion?: Promotion;

  constructor(
    private promotionService: PromotionsService, 
    private activatedRoute: ActivatedRoute, 
    private bsService: BreadcrumbService,
    private titleService: Title) 
  {
    this.bsService.set('@promotionPage', ' ');
  }
  
  ngOnInit(): void {
    this.loadPromotion();
  }

  loadPromotion() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.promotionService.getPromotion(+id).subscribe( {
        next: promotion => {
          this.promotion = promotion
          this.bsService.set('@promotionPage', promotion.product.name);
          this.titleService.setTitle(`Bambeo • Promocja na ${promotion.product.name}`);
        },
        error: err => console.log(err)
      });
    }
  }
}
