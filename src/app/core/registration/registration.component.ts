import { Component } from '@angular/core';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Registration } from '../../shared/models/registrationdata';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { Router } from '@angular/router';
import { NewUserHttp } from '../../shared/services/newUserHttp.service';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-registration', 
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})


export class RegistrationComponent {
[x: string]: any;
  confirmPassword: string ='';

  constructor(private UserHttp: NewUserHttp, private redirect: Router) {}

  newRegistration: Registration = new Registration(); //il nuovo user registrato ha solo la password in chiaro

  Registrated: Registration[] = []

  Registration(frm: NgForm) {  
    if (frm.valid) {

      console.log("Password 1: "+ frm.value.passwordInput)
      console.log("Password 2: "+ frm.value.confirmPasswordInput)

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

      // Invia i dati del modulo al server o esegui altre azioni necessarie
      console.log('Form submitted successfully!');

      // Copia solo i campi necessari dalla form all'istanza di newRegistration
      this.newRegistration.firstName = frm.value.nameInput;
      this.newRegistration.lastName = frm.value.surnameInput;
      this.newRegistration.emailAddress = frm.value.emailInput;
      this.newRegistration.phone = frm.value.phoneInput;
      this.newRegistration.password = frm.value.passwordInput;


      //this.newRegistration = frm.value;

      console.log(this.newRegistration)

      console.log("First Name: "+ this.newRegistration.firstName)
      console.log("Last Name: "+ this.newRegistration.lastName)
      console.log("Mail: "+ this.newRegistration.emailAddress)
      console.log("Phone: "+ this.newRegistration.phone)

      //DemonSalvatore1! - password in chiaro 
      console.log('Password in chiaro: '+this.newRegistration.password)
      this.newRegistration.password = window.btoa(this.newRegistration.password); //---> cifra "undefined" :'(
      console.log(this.newRegistration.password)

      //ora che ho criptato posso inviare al backedn il nuovo user
      this.PostRegistration();

    } else {
      // Mostra un alert o un messaggio di errore appropriato
      alert('Per favore, compila tutti i campi obbligatori correttamente.');
    }
  }

  // Funzione per verificare se la password soddisfa i criteri richiesti
  isPasswordValid(password: string): boolean {
    // Almeno 8 caratteri, una maiuscola, una minuscola e un carattere speciale
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/; //mi sono fatto aiutare da ChatGPT qui
    return passwordRegex.test(password);
  }

  //Ok- ora ho il mio user con la password in chiaro e devo criptarla - non so se farlo lato back-end
  PostRegistration(){
    console.log(this.newRegistration)
    console.log("2 First Name: "+ this.newRegistration.firstName)
    console.log("2 Last Name: "+ this.newRegistration.lastName)
    console.log("2 Mail: "+ this.newRegistration.emailAddress)
    console.log("2 Phone: "+ this.newRegistration.phone)

    this.UserHttp.PostNewRegistration(this.newRegistration).subscribe({
     next: (response: any) => {
      switch(response.status) {
        case HttpStatusCode.Ok:
          alert("Ti sei registrato! Verrai reindirizzato alla pagina del login!");
          this.redirect.navigate(['/login']);
          break;
        default: break;
      }
    },
    error: (err: any) => {
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
