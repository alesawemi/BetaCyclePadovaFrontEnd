import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http'
import {CookieService, SameSite} from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { JwtHelperService } from '@auth0/angular-jwt';
import { RoleService } from './role.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  
//#region VARIABLE DECLARATIONS

  jwtToken: string = '';
  private name: string = window.btoa("jwt_token");
  private isLogged: boolean = false;
  public  authHeader = new HttpHeaders({
    contentType: 'application/json',
    responseType: 'text'
  });

  private jwtExpirationTimer: any; // This is a timer that keeps track of the session
  private jwtHelper: JwtHelperService = new JwtHelperService();
  
  // In my backend, I have two types of authentication - currently using jwt (better)
  public TypeOfAuthorization: string = 'jwt'; // 'basic'

  //#endregion
  
//#region CONSTRUCTOR
  // This is the first thing that runs when the page loads and on refresh

  constructor(
    private cookie: CookieService, 
    private router: Router, 
    private role: RoleService
  ) {
    if (this.cookie.check(this.name)) { // Check if the cookie already exists
      // Calculate the expiration of the token and the cookie
      this.jwtToken = this.cookie.get(this.name);
      const tokenExpirationDate = this.parseJwtExpiration(this.jwtToken);
      // If the current date and time is less than the expiration date and time
      if (new Date() < tokenExpirationDate) { // It means the token is still valid
        this.isLogged = true;

        // Update the role
        const decodedToken = this.jwtHelper.decodeToken(this.jwtToken);
        const role = decodedToken.role;
        this.setRole(role);

        this.authHeader = this.authHeader.set(
          'Authorization',
          'Bearer ' + this.jwtToken
        );
        this.startJwtExpirationTimer();
      } else { // Otherwise, execute the logout
        this.Logout();
      }
    }
  }
//#endregion
 
//#region METHODS

  // This method tells me if I am logged in (isLogged=true) or not (isLogged=false)
  getLoginStatus() {
    return this.isLogged;
  }

  // Set the role
  setRole(role: string) {
    console.log(this.role.setUserRole(role))
   }
  
  //#region BASIC
  // This sets true or false for basic (which I am currently not using)
  // setLoginStatusBasic(logValue: boolean, usr: string='', psw: string=''){
  //   this.isLogged = logValue;

  //   if (logValue) {      
  //       localStorage.setItem('token', window.btoa(usr + ':' + psw));

  //       this.authHeader = this.authHeader.set(
  //         'Authorization',
  //         'Basic ' + window.btoa(usr + ':' + psw));      
  //   }

  //   else {
  //     localStorage.removeItem('token');
  //     this.authHeader = new HttpHeaders({
  //       contentType: 'application/json',
  //       responseType: 'text'
  //     });
  //   }
  // }

//#endregion 
  
  
  //#region JWT TOKEN
  // This sets true or false for JWT (which I AM USING)
  setLoginStatusJwt(logValue: boolean, jwtToken: string=''){
    this.isLogged = logValue;
    this.jwtToken = jwtToken;

    if (logValue) {    
       // Use localstorage to save the authentication - not a good solution  
        // localStorage.setItem('token', jwtToken);

        // If it does not find it, generate a new one
        if (!this.cookie.check(this.name)) {
          this.router.navigate(['home']); // Redirect to home
          this.setJwtCookie(jwtToken);
        }
        else
        {
          alert("You are already logged in");
        }

        this.startJwtExpirationTimer();

        // Authentication header - set to Bearer
        this.authHeader = this.authHeader.set(
        'Authorization',
        'Bearer ' + jwtToken);
    }

    else {
      //localStorage.removeItem('token');
      this.cookie.delete(this.name); // Do the same as localstorage but with the cookie
      this.authHeader = new HttpHeaders({
        'Content-Type': 'application/json',
        'Response-Type': 'text'
      });
    }
  }
//#endregion

  //#region COOKIE
  private setJwtCookie(jwtToken: string){
    // Use Cookies      
    let expires: Date = new Date();
    expires.setMinutes(expires.getMinutes() + 30); // 10 minutes expiration - take from token
    let path: string = "/";
    let domain: string = "localhost"
    let secure: boolean = true;
    let sameSite : SameSite = "Lax" // Options are "Strict" | "Lax" | "None"

    // Cookie parameters: Name(index)|Value|Domain|Path|Expires/Max-Age|Size|HttpOnly|Secure!SameSite|Partition Key|Priority
    this.cookie.set(
      this.name,         // Name
      jwtToken,     // JWT Token
      expires,      // Expiration date (optional)
      path,         // Path (optional)
      domain,       // Domain (optional)
      secure,       // Secure (optional)
      sameSite,     // SameSite (optional)
    //partitioned?   // Partitioned (optional)
);
  }

   // Method to start the JWT cookie expiration timer
   private startJwtExpirationTimer() {
    const expirationDate = this.parseJwtExpiration(this.jwtToken);
    const expiresIn = expirationDate.getTime() - Date.now(); // Calculate when the token expires

    if (expiresIn > 0) { // If greater than 0, it means it is valid
      this.jwtExpirationTimer = setTimeout(() => { // Start a countdown and understand when the token expires
        this.Logout(); // Call Logout() when the token expires
      }, expiresIn);

      // Set the timer to notify 30 seconds before expiration
      if (expiresIn > 30000) { // Check that at least 30 seconds remain
        setTimeout(() => {
            this.notifyTokenExpiring(); // Call the notification function
        }, expiresIn - 30000);
    } else {
        this.notifyTokenExpiring(); // Notify immediately if less than 30 seconds remain
    }

  } else {
      this.Logout(); // If the token has already expired, execute Logout() immediately
  }
  }

  // Notification function
private notifyTokenExpiring() {
  alert('The token is about to expire, you will be logged out in 30 seconds.');
}


  // Get the Expiration data corresponding to the ticket
  private parseJwtExpiration(token: string): Date {
    const jwtPayload = JSON.parse(atob(token.split('.')[1]));
    return new Date(jwtPayload.exp * 1000);
  }


  // Method to stop the JWT cookie expiration timer - this must be done - I asked for advice from the highest authority
  private stopJwtExpirationTimer() {
    if (this.jwtExpirationTimer) {
      clearTimeout(this.jwtExpirationTimer);
    }
  }
//#endregion

  //#region  LOGOUT
  Logout() {
    //if (this.TypeOfAuthorization === 'basic') this.setLoginStatusBasic(false);
    if (this.TypeOfAuthorization === 'jwt') {
        //this.setLoginStatusJwt(false , this.jwtToken);
        this.isLogged = false;
        const decodedToken = this.jwtHelper.decodeToken(this.jwtToken);
        const role = decodedToken.role;
        this.setRole('user');
        this.cookie.delete(this.name);
        this.authHeader = new HttpHeaders({
            contentType: 'application/json',
            responseType: 'text'
        });
        alert("You have been logged out!"); // To understand if to keep it active or not
        this.stopJwtExpirationTimer();

        //window.localStorage.clear();
        
        this.router.navigate(['home']); // Redirect to home
    }
  }
//#endregion


  //#region GET USERNAME FROM JWT TOKEN

  // Method to decode the JWT and get the username
  getEmailFromJwt(): string {
    if (this.jwtToken) {
      const decodedToken: any = jwtDecode(this.jwtToken);
      return decodedToken.unique_name || ''; // Make sure the claim name is correct
    }
    return '';
  }
//#endregion

//#endregion
}
