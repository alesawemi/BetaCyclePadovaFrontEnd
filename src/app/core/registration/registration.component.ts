import { Component } from '@angular/core';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Registration } from '../../shared/models/registrationdata';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { Router } from '@angular/router';
import { NewUserHttp } from '../../shared/services/newUserHttp.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  confirmPassword: string ='';

  constructor(private UserHttp: NewUserHttp) {}

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
     next: (jsData: any) => {
       this.Registrated= jsData      
       alert("Hai inviato un nuovo user")
    },
    error: (erreur: any) => {
      console.log(erreur)
    }
   })
  }
}
