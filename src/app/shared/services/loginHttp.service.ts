import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Credentials } from '../models/credentials';

@Injectable({
  providedIn: 'root'
})
export class LoginHttpService {

 mail: string = '';

  constructor(private http: HttpClient) { }

  LoginPost(credential: Credentials): Observable<any>{
    this.mail = credential.username;
    return this.http.post(`https://localhost:7228/login`, credential, 
    {   
      observe: 'response'
    })
  }

  
}

