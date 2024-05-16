import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Filters } from '../models/productsFilters';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private http: HttpClient) { }

  GetAll(url: string): Observable<any>{
    return this.http.get(url);
  }

  GetProperties(url: string): Observable<any>{
    return this.http.get(url);
  }

  GetWithFilters(url: string, filters: Filters): Observable<any>{
    return this.http.post(url, filters, {   
      observe: 'response'
    });
  }

}
