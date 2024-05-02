import { HttpStatusCode } from '@angular/common/http';
import { Component } from '@angular/core';
import { Credentials } from '../../shared/models/credentials';
import { LoginHttpService } from '../../shared/services/loginHttp.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginCredentials: Credentials = new Credentials();

  constructor(private http: LoginHttpService) {}

  Login(usr: HTMLInputElement, pwd: HTMLInputElement)
  {
      if(usr.value != '' && pwd.value != '') //questo è solo un piccolo controllo - manca il resto
      {
        //se ci sono le valorizzo
        this.loginCredentials.username = usr.value;
        this.loginCredentials.password = pwd.value;

        console.log('Username: ' + this.loginCredentials.username + ' Password: '+this.loginCredentials.password)

        //passo le credenziali al metodo per autenticarmi.
        this.http.LoginPost(this.loginCredentials).subscribe(resp => {
          console.log('Risposta: '+ resp)
          if(resp.status === HttpStatusCode.Ok)
          {
            /*
            //NICHOLAS: RAGIONARE SU SESSIONE (refresh pagina e sono ancora dentro)
            //+ COOKIES (chiudo Browser e riapro entro 10 min e sono ancora dentro)
            //Questo risolve la richiesta di Orloff
            */

            console.log("LOGIN OK!") //NICHOLAS: FUNZIONA

            //NICHOLAS: a me non piace molto come soluzione - da vedere se farla come esempio
            //salvo in local storage con token criptato - risolto il problema della condivisione
            localStorage.setItem('token', window.btoa(usr.value + ':' + pwd.value))

            //PROF: POTREI IMPOSTARE UN BOOLEAN GLOBALE isAuthenticated = true; --accendi e spegni i vari menù
          }
          else
          {
            console.log('LOGIN NON RIUSCITO: '+ resp.status)
          }
            
        });
      }
      else
        alert('Username e Password, obbligatori!'); //è una sottoscrizione di una chiamata vera e propria
  }
}
