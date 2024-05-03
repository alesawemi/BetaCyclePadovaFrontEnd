import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http'
import { TypeofExpr } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private isLogged: boolean = false;

  // header è sempre dello stesso tipo sia per basic che per jwt
  authHeader = new HttpHeaders({
    contentType: 'application/json',
    responseType: 'text'
  });

  // ma a seconda del tipo di autorizzazione scelto in localStorage salviamo cose diverse in corrispondenza della chiave 'token'
  // e anche l'header verrà riempito in modo diverso
  private TypeOfAuthorization: string = 'basic'; // 'jwt'

  constructor() { }

  getLoginStatus() {
    return this.isLogged;
  }

  setLoginStatus(logValue: boolean, usr: string='', psw: string=''){
    this.isLogged = logValue;

    if (logValue) {

      if (this.TypeOfAuthorization === 'basic') {
        localStorage.setItem('token', window.btoa(usr + ':' + psw));

        this.authHeader = this.authHeader.set(
          'Authorization',
          'Basic ' + window.btoa(usr + ':' + psw));
      }

      // // COMMENTATO PERCHE' NON HO ANCORA jwtToken
      // if (this.TypeOfAuthorization === 'jwt') {
      //   localStorage.setItem('token', jwtToken);

      //   this.authHeader = this.authHeader.set(
      //     'Authorization',
      //     'Bearer ' + jwtToken);
      // }

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
    this.setLoginStatus(false);
  }


}