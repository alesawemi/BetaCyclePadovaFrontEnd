import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Credentials } from '../models/credentials';

@Injectable({
  providedIn: 'root'
})
export class LoginHttpService {

  constructor(private http: HttpClient) { }

  LoginPost(credential: Credentials): Observable<any>{
    return this.http.post(`https://localhost:7228/login`, credential, 
    {   
      observe: 'response'
    })
  }
}

