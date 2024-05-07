import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ErrorHandlingService } from './error-handling.service';
import { ApiResponse } from '../models/api/responses/apiResponse';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  constructor(
    private http: HttpClient,
    private errorHandlingService: ErrorHandlingService
  ) { }

  baseUrl = environment.apiUrl;

  private request<T>(method: 'get' | 'post' | 'patch' | 'put' | 'delete', 
  endpoint: string, data?: any, headers?: HttpHeaders): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const options = {
      headers: headers,
      withCredentials: true,
      body: method === 'delete' ? undefined : data,
      observe: 'response' as const
    };
  
    return this.http.request<ApiResponse<T>>(method, url, options).pipe(
      map(response => {
        if (response.status === 204) {
          return undefined as unknown as T;
        }
        if (response.body && response.body.success && response.body.payload) {
          return response.body.payload;
        } else {
          throw new Error('Something went wrong with the API.');
        }
      }),
      catchError(error => this.errorHandlingService.handleError(error) as Observable<never>)
    );
  }

  get<T>(endpoint: string, headers?: HttpHeaders): Observable<T> {
    return this.request<T>('get', endpoint, null, headers);
  }
  
  post<T>(endpoint: string, data: any = null, headers?: HttpHeaders): Observable<T> {
    return this.request<T>('post', endpoint, data, headers);
  }
  
  patch<T>(endpoint: string, data: any, headers?: HttpHeaders): Observable<T> {
    return this.request<T>('patch', endpoint, data, headers);
  }
  
  put<T>(endpoint: string, data: any, headers?: HttpHeaders): Observable<T> {
    return this.request<T>('put', endpoint, data, headers);
  }
  
  delete<T>(endpoint: string, headers?: HttpHeaders): Observable<T> {
    return this.request<T>('delete', endpoint, null, headers);
  }
}
