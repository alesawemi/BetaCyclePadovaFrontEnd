import {Injectable} from '@angular/core';
@Injectable({
    providedIn: 'root'
})
export class AuthenticationService{
    private isLogged: boolean = false; //E' loggato??
    constructor() {}
    setLoginStatus(logValue: boolean, usr: string = '', psw: string = '') {
        if(logValue)
        {
            localStorage.setItem('token', window.btoa(usr+':'+psw));
            this.isLogged = true;
        }
        else 
        {
            localStorage.removeItem('token');
            this.isLogged = false;
        }
    }
    getLoginStatus() {
        return this.isLogged //ritorna se è autenticato oppure no
    }
}