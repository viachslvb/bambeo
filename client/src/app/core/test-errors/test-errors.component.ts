import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-test-errors',
  templateUrl: './test-errors.component.html',
  styleUrls: ['./test-errors.component.css']
})
export class TestErrorsComponent {
  constructor(private http: HttpClient) { }

  baseUrl = environment.apiUrl;

  get500Error() {
    this.http.get(this.baseUrl + 'bugger/servererror').subscribe({
      next: response => console.log(response),
      error: err => console.log(err)
    });
  }

  get400Error() {
    this.http.get(this.baseUrl + 'bugger/badrequest').subscribe({
      next: response => console.log(response),
      error: err => console.log(err)
    });
  }

  createTestItem() {
    this.http.get(this.baseUrl + 'redis').subscribe({
      next: response => console.log(response),
      error: err => console.log(err)
    });
  }
}
