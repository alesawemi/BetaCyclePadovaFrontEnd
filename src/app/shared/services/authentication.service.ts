import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http'
import { TypeofExpr } from '@angular/compiler';
import {CookieService, SameSite} from 'ngx-cookie-service';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  jwtToken: string = '';
  private name: string = window.btoa("jwt_token");
  private isLogged: boolean = false;
  private authHeader = new HttpHeaders({
    contentType: 'application/json',
    responseType: 'text'
  });
  
  constructor(private cookie: CookieService) {
    if (!this.cookie.check(this.name)) {
      this.jwtToken = this.cookie.get(this.name);
      this.setLoginStatusJwt(true, this.jwtToken);
    }
    else {
      this.jwtToken = this.cookie.get(this.name);
      this.setLoginStatusJwt(false, this.jwtToken);
    }
  }
 

  private jwtExpirationTimer: any; //è un timer che mi tiene conto della sessione

  //nel mio backend ho due tipi di autenticazione - al momento sto usando la jwt (migliore)
  public TypeOfAuthorization: string = 'jwt'; // 'basic'


  //questo metodo mi serve a sapere se sono loggato (isLogged=true) oppure no (isLogged=false)
  getLoginStatus() {
    return this.isLogged;
  }

//Questo serve ad impostare true o false per la basic (che al momento sono sto usando)
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

  
  //Questo serve ad impostare true o false per la JWT (che STO USANDO)
  setLoginStatusJwt(logValue: boolean, jwtToken: string=''){
    this.isLogged = logValue;
    this.jwtToken = jwtToken;

    if (logValue) {    
       //Utilizzo della localstorage per salvare l'autenticazione - non è una buona soluzione  
        // localStorage.setItem('token', jwtToken);

        // this.authHeader = this.authHeader.set(
        //   'Authorization',
        //   'Bearer ' + jwtToken);

        //Utilizzo di Cookies
        
        let expires: Date = new Date();
        expires.setMinutes(expires.getMinutes() + 1); //10 minuti di scadenza - da prendere dal token
        let path: string = "/";
        let domain: string = "localhost"
        let secure: boolean = true;
        let sameSite : SameSite = "Lax" //le opzioni sono "Strict" | "Lax" | "None"

        //Parametri del cookie: Name(index)|Value|Domain|Path|Exipers/Max-Age|Size|HttpOnly|Secure!SameSite|Partition Key|Priority
        this.cookie.set(
          this.name,         //Nome
          jwtToken,     // Token JWT
          expires,      // Data di scadenza (opzionale)
          path,         // Percorso (opzionale)
          domain,       // Dominio (opzionale)
          secure,       // Secure (opzionale)
          sameSite,     // SameSite (opzionale)
       //partitioned?   // Partizionato (opzionale)
        );

        this.startJwtExpirationTimer();

        //Header dell'autenticazione
        this.authHeader = this.authHeader.set(
        'Authorization',
        'Bearer ' + jwtToken);
    }

    else {
      //localStorage.removeItem('token');
      

    }
  }

   // Metodo per avviare il timer di scadenza del cookie JWT
   private startJwtExpirationTimer() {
    const expirationDate = this.parseJwtExpiration(this.jwtToken);
    const expiresIn = expirationDate.getTime() - Date.now(); //calcolo quando scade il token
    if (expiresIn > 0) { //se è maggiore di 0 vuol dire che è valido
      this.jwtExpirationTimer = setTimeout(() => { //mi parte poi un countdown e capisce quando scade il token
          this.Logout(); // Chiama Logout() quando il token è scaduto
      }, expiresIn);
  } else {
      this.Logout(); // se il token è già scaduto eseguo subito il Logout()
  }
  }

  //prende il dato Expiration corrispondente al ticket
  private parseJwtExpiration(token: string): Date {
    const jwtPayload = JSON.parse(atob(token.split('.')[1]));
    return new Date(jwtPayload.exp * 1000);
  }


  // Metodo per fermare il timer di scadenza del cookie JWT - va fatto - ho chiesto consiglio all'altissimo
  private stopJwtExpirationTimer() {
    if (this.jwtExpirationTimer) {
      clearTimeout(this.jwtExpirationTimer);
      window.localStorage.clear();
      window.location.reload(); //serve a ricaricare la pagina (fare un refresh)
    }
  }


  Logout() {
    if (this.TypeOfAuthorization === 'basic') this.setLoginStatusBasic(false);
    if (this.TypeOfAuthorization === 'jwt') {
        this.setLoginStatusJwt(false);
        this.cookie.delete(window.btoa('jwt_token'));
        this.authHeader = new HttpHeaders({
            contentType: 'application/json',
            responseType: 'text'
        });
        alert("Ti sei sloggato!");
        this.stopJwtExpirationTimer();
        window.localStorage.clear();
        window.location.reload(); // Serve a ricaricare la pagina (fare un refresh)
    }
  }
}