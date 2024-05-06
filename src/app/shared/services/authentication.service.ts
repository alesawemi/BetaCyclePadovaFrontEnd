import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http'
import { TypeofExpr } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private isLogged: boolean = false;

  authHeader = new HttpHeaders({
    contentType: 'application/json',
    responseType: 'text'
  });

  public TypeOfAuthorization: string = 'jwt'; // 'basic'

  constructor() { }


  getLoginStatus() {
    return this.isLogged;
  }


  setLoginStatusBasic(logValue: boolean, usr: string='', psw: string=''){
    this.isLogged = logValue;

    if (logValue) {      
        localStorage.setItem('token', window.btoa(usr + ':' + psw));

        this.authHeader = this.authHeader.set(
          'Authorization',
          'Basic ' + window.btoa(usr + ':' + psw));      
    }

    else {
      localStorage.removeItem('token');
      this.authHeader = new HttpHeaders({
        contentType: 'application/json',
        responseType: 'text'
      });
    }
  }


  setLoginStatusJwt(logValue: boolean, jwtToken: string=''){
    this.isLogged = logValue;

    if (logValue) {      
        console.log("Siamo in Auth Service:")
        console.log(jwtToken)
        localStorage.setItem('token', jwtToken);

        this.authHeader = this.authHeader.set(
          'Authorization',
          'Bearer ' + jwtToken);
    }

    else {
      localStorage.removeItem('token');
      this.authHeader = new HttpHeaders({
        contentType: 'application/json',
        responseType: 'text'
      });
    }
  }


  Logout() {
    if (this.TypeOfAuthorization === 'basic') this.setLoginStatusBasic(false);
    if (this.TypeOfAuthorization === 'jwt') this.setLoginStatusJwt(false);
  }

}