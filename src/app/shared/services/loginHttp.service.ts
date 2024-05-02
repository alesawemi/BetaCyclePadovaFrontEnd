import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Credentials } from '../models/credentials';

@Injectable({
  providedIn: 'root'
})
export class LoginHttpService {

  constructor(private http: HttpClient) { }

  //potrei già averlo pronto, se mi loggo nella storage 
  newHeader = new HttpHeaders({
    contentType: 'application/json',
    responseType: 'text',
  });

  LoginPost(credential: Credentials): Observable<any>{

      this.newHeader = this.newHeader.set(
        'Authorization',
        'Basic ' + window.btoa('abcd:efgh')
      )

    return this.http.post(`https://localhost:7228/login`, credential, 
    {   
       headers: this.newHeader,
       observe: 'response'
    })
  }

  //IPOTETICA NUOVA CHIAMATA HTTP, LEGGERA' LE CREDENZIALI DALLA LOCALSTORAGE:
  //THIS.VALIDCREDENTIALS = LOCALSTORAGE.GETITEM('TOKEN')
}
