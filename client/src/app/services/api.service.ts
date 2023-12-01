import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../shared/models/api/apiResponse';
import { ErrorHandlingService } from './error-handling.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(
    private http: HttpClient,
    private errorHandlingService: ErrorHandlingService
  ) { }

  baseUrl = environment.apiUrl;

  get<T>(endpoint: string, headers?: HttpHeaders): Observable<T> {
    const options = headers ? { headers: headers } : {};

    return this.http.get<ApiResponse<T>>(this.baseUrl + endpoint, options).pipe(
      map((response: ApiResponse<T>) => {
        if (response.success && response.payload) {
          return response.payload;
        } else {
          throw new Error('Something went wrong with the API.');
        }
      }),
      catchError((error: any) => {
        return this.errorHandlingService.handleError(error) as Observable<never>;
      })
    );
  }

  post<T>(endpoint: string, data: any, headers?: HttpHeaders): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const options = headers ? { headers: headers } : {};

    return this.http.post<ApiResponse<T>>(url, data, options).pipe(
      map((response: ApiResponse<T>) => {
        if (response.success && response.payload) {
          return response.payload;
        } else {
          throw new Error('Something went wrong with the API.');
        }
      }),
      catchError((error: any) => {
        return this.errorHandlingService.handleError(error) as Observable<never>;
      })
    );
  }
}
