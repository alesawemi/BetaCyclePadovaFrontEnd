import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccessoriesService {

  constructor(private http: HttpClient) { }

  GetAccessories(): Observable<any>{
    return this.http.get(`https://localhost:7228/api/AccessoriesViews`);
  }

}
