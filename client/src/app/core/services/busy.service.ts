import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})

export class BusyService {
  constructor(private spinnerService: NgxSpinnerService) { }

  busy(name: string) {
    this.spinnerService.show(name);
  }

  idle(name: string) {
    this.spinnerService.hide(name);
  }
}