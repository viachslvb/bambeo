import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { Paginator } from 'primeng/paginator';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})

export class PaginatorComponent implements AfterViewInit, OnChanges {
  @Input() totalCount!: number;
  @Input() pageSize!: number;
  @Input() pageIndex!: number;
  @Output() pageChange = new EventEmitter<number>();
  @ViewChild('paginator', { static: true }) paginator!: Paginator;
  @ViewChild('prevPageLinkIconTemplate') prevPageLinkIconTemplate!: TemplateRef<any>;
  @ViewChild('nextPageLinkIconTemplate') nextPageLinkIconTemplate!: TemplateRef<any>;

  showFirstLastIcon: boolean = false;
  isProgrammaticChange: boolean = false;

  ngAfterViewInit(): void {
    this.paginator.previousPageLinkIconTemplate = this.prevPageLinkIconTemplate;
    this.paginator.nextPageLinkIconTemplate = this.nextPageLinkIconTemplate;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['totalCount'] && changes['totalCount'].currentValue) {
      this.showFirstLastIcon = this.totalCount / this.pageSize >= 8;
    }

    if (changes['pageIndex']) {
      setTimeout(() => {
        this.isProgrammaticChange = true;
        this.paginator?.changePage(this.pageIndex - 1);
        this.isProgrammaticChange = false;
      });
    }
  }

  onPageChange(event: any) {
    if (!this.isProgrammaticChange) {
      this.pageChange.emit(event);
    }
  }
}