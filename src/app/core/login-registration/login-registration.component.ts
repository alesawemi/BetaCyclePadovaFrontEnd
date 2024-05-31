import { Component } from '@angular/core';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Registration } from '../../shared/models/registrationdata';
import { NewUserHttp } from '../../shared/services/newUserHttp.service';
import { HttpStatusCode } from '@angular/common/http';
import { Credentials } from '../../shared/models/credentials';
import { LoginHttpService } from '../../shared/services/loginHttp.service';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { Router } from '@angular/router';
import { LogtraceService } from '../../shared/services/logtrace.service';
import { LogTrace } from '../../shared/models/LogTraceData';
import { JwtHelperService } from '@auth0/angular-jwt';
import { RoleService } from '../../shared/services/role.service';
import { AdminPanelComponent } from '../../features/admin-panel/admin-panel.component';
@Component({
  selector: 'app-login-registration',
  standalone: true,
  imports: [FormsModule, CommonModule,AdminPanelComponent],
  templateUrl: './login-registration.component.html',
  styleUrl: './login-registration.component.css'
})

export class LoginRegistrationComponent {
  
  constructor(
    private router: Router,

    // per gestione errori centralizzata
    private logtrace: LogtraceService,

    // per la registration:
    private UserHttp: NewUserHttp, 

    // per il login:
    private http: LoginHttpService, private auth: AuthenticationService,
    private roleService:RoleService
  ) {}



  //fEnd LogTrace
  fEndError: LogTrace = new LogTrace;









  // REGISTRATION //////////////////////////////////////////////////////////////////////////////////////////////
  
  [x: string]: any;
  confirmPassword: string ='';  
  passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$!%*?&])[A-Za-z\d$!%*?&]{8,}$/; //mi sono fatto aiutare da ChatGPT qui

  newRegistration: Registration = new Registration(); //il nuovo user registrato ha solo la password in chiaro

  Registrated: Registration[] = []

  pass: string = '';

  passwordsMatch: boolean = false;

  checkPasswordMatch() {
      this.passwordsMatch = this.pass === this.confirmPassword;
  }



  Registration(frm: NgForm) {  
    if (frm.valid) {

      

      // Verifica se la password soddisfa i criteri richiesti
      if (!this.isPasswordValid(frm.value.passwordInput)) {
        alert('La password deve contenere almeno 8 caratteri, una maiuscola, una minuscola e un carattere speciale.');
        return;
      }

    // Verifica se la conferma della password corrisponde alla password
      if (frm.value.passwordInput !== frm.value.confirmPasswordInput) {
        alert('La password e la conferma della password non corrispondono.');
        return;
      }

      // Invia i dati del modulo al server 

      // Copia solo i campi necessari dalla form all'istanza di newRegistration
      this.newRegistration.firstName = frm.value.nameInput;
      this.newRegistration.lastName = frm.value.surnameInput;
      this.newRegistration.emailAddress = frm.value.emailInput;
      this.newRegistration.phone = frm.value.phoneInput;
      this.pass = frm.value.passwordInput;

      this.newRegistration.password = window.btoa(this.pass); 

      //ora che ho criptato posso inviare al backend il nuovo user
      this.PostRegistration();

    } else {
      // Mostra un alert o un messaggio di errore appropriato
      alert('Per favore, compila tutti i campi obbligatori correttamente.');
    }
  }

  // Funzione per verificare se la password soddisfa i criteri richiesti
  isPasswordValid(password: string): boolean {
    // Almeno 8 caratteri, una maiuscola, una minuscola e un carattere speciale
    
    return this.passwordRegex.test(password);
  }

  //Ok- ora ho il mio user con la password in chiaro e devo criptarla - non so se farlo lato back-end
  PostRegistration(){
    this.UserHttp.PostNewRegistration(this.newRegistration).subscribe({
     next: (response: any) => {
      switch(response.status) {
        case HttpStatusCode.Ok:
          alert("Benvenuto! Per favore, esegui l'accesso al tuo account nella sezione Login");
          this.router.navigate(['login&registration']); // Redirect alla pagina di login
          break;
        default: break;
      }
    },
    error: (err: any) => {
      this.fEndError = new LogTrace;
      this.fEndError.Level = 'login-registration';
      this.fEndError.Message = 'An Error Occurred in PostRegistration';
      this.fEndError.Exception = err.toString();
      this.logtrace.PostError(this.fEndError);
      console.log(err)
      if (err.status === 409) { // Conflitto (Utente già nel DB)
        alert("Utente già presente nel database.");
    } else {
        // Gestisci altri casi di errore
        console.error('Si è verificato un errore:', err);
    }
    }
   })
  }











  // LOGIN /////////////////////////////////////////////////////////////////////////////////////////////////////
  loginCredentials: Credentials = new Credentials();
  private jwtHelper: JwtHelperService = new JwtHelperService();

  jwtToken: string = '';
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
              // if (this.auth.TypeOfAuthorization ===  'basic') 
              //   { this.auth.setLoginStatusBasic(true, usr.value, pwd.value); }
              if (this.auth.TypeOfAuthorization ===  'jwt') 
              {
                this.jwtToken = response.body.token;
                this.auth.setLoginStatusJwt(true, this.jwtToken);
                const decodedToken = this.jwtHelper.decodeToken(this.jwtToken);
                const role = decodedToken.role;
                this.setRole(role);
              ;
                
              }
              console.log("LOGIN OK!"); //in questo caso non serve "notifica" di loginOk perché si attivano voci di menu prima nascoste (logout, carrello etc)
              this.router.navigate(['home']); // Redirect alla home
              break;
            case HttpStatusCode.NoContent:
              
              break;
          }
        },
        error: (err: any) => {
          this.fEndError = new LogTrace;
          this.fEndError.Level = 'login-registration';
          this.fEndError.Message = 'An Error Occurred in Loginn';
          this.fEndError.Exception = err.toString();
          this.logtrace.PostError(this.fEndError);
      
          // if (this.auth.TypeOfAuthorization ===  'basic') 
          //   { this.auth.setLoginStatusBasic(false); }
          if (this.auth.TypeOfAuthorization ===  'jwt') 
            { this.auth.setLoginStatusJwt(false); }
          
          
          //trovare soluzione alternativa a alert --> popup con finestra di dialogo?
          if (err.status === 404) {
              //alert("REGISTRATI!");  //fare redirect alla pagina di login/registrazione
              const container = document.getElementById('container');
              if (container) {
                container.classList.add("right-panel-active");
              } else {
                console.error("Container element is null.");
              }
          }
          if (err.status === 400) alert(err.error.message);            
        }
      });
    }
    else alert('Attenzione! Username e Password Obbligatori.');
  }


//Imposto il ruolo
  setRole(role: string) {
   console.log(this.roleService.setUserRole(role))
  }







  // CODICE PER L'ANIMAZIONE ///////////////////////////////////////////////////////////////////////////////////
  //Esegue codice javascript dopo l'inizializzazione dei componenti 
  ngOnInit(): void {
    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');
    const container = document.getElementById('container');
  
    // Controllo di nullità prima di utilizzare gli elementi
    if (signUpButton && signInButton && container) {
      signUpButton.addEventListener('click', () => {
        container.classList.add("right-panel-active");
      });
  
      signInButton.addEventListener('click', () => {
        container.classList.remove("right-panel-active");
      });
    } else {
      console.error("One or more elements are null.");
    }
  }
  


}
