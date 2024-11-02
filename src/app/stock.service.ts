 
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', // Ensures that this service is available throughout the app
})
export class StockService { 
  private apiUrl = 'https://localhost:7228/api/Stock/';
  constructor(private http: HttpClient) {}

  getStockData(company: string): Observable<any> {
    return this.http.get(`${this.apiUrl}?symbol=${company}`); // Adjust according to your API
  }
}
