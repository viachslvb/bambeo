import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { ScrollService } from './core/services/scroll.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Bambeo';

  constructor(
    private authService: AuthService,
    private scrollService: ScrollService
  ) { }

  ngOnInit(): void {
    this.authService.initializeAuthState().subscribe();
  }
}