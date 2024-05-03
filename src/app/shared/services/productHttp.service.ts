import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})

export class ProductHttpService {

  constructor(private http: HttpClient, private auth: AuthenticationService) { }

  httpGetProducts(): Observable<any>{
    return this.http.get(`https://localhost:7228/api/Products`, {headers: this.auth.authHeader});
  }

}
