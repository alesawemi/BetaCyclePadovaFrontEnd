import { HttpStatusCode } from '@angular/common/http';
import { Component } from '@angular/core';
import { Credentials } from '../../shared/models/credentials';
import { LoginHttpService } from '../../shared/services/loginHttp.service';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { AuthenticationService } from '../../shared/services/authentication.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule,FooterComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginCredentials: Credentials = new Credentials();

  constructor(private http: LoginHttpService, private auth: AuthenticationService) {}

  Login(usr: HTMLInputElement, pwd: HTMLInputElement)
  {
      if(usr.value != '' && pwd.value != '') //controllo ripetuto nel backend
      {
        this.loginCredentials.username = usr.value;
        this.loginCredentials.password = pwd.value;

        // inserisci credenziali e poi clicchi su login --> resettare campi email e psw?
        this.http.LoginPost(this.loginCredentials).subscribe({
        next: (response: any) => {
          switch(response.status) {
            case HttpStatusCode.Ok:
              this.auth.setLoginStatus(true, usr.value, pwd.value);
              console.log("LOGIN OK!"); //in questo caso non serve "notifica" di loginOk perché si attivano voci di menu prima nascoste (logout, carrello etc)
              break;
            case HttpStatusCode.NoContent:
              break;
          }
        },
        error: (err: any) => {
          this.auth.setLoginStatus(false);
          
          //trovare soluzione alternativa a alert --> popup con finestra di dialogo?
          if (err.status === 404) alert("REGISTRATI!"); //fare redirect alla pagina di login/registrazione
          if (err.status === 400) alert(err.error.message);            
        }
      });
    }
    else alert('Attenzione! Username e Password Obbligatori.');
  }
}
