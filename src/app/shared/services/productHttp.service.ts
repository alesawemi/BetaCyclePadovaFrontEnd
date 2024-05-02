import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ProductHttpService {

  constructor(private http: HttpClient) { }

  httpGetProducts(): Observable<any>{
    return this.http.get(`https://localhost:7228/api/Products`);
  }

}
