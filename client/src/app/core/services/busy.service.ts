import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})

export class BusyService {
  constructor(private spinnerService: NgxSpinnerService) { }

  mainSpinner = 'pageLoadingSpinner';

  busy(name: string = this.mainSpinner) {
    this.spinnerService.show(name);
  }

  idle(name: string = this.mainSpinner) {
    this.spinnerService.hide(name);
  }
}