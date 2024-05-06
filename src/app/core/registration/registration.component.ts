import { Component } from '@angular/core';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NewCustomer } from '../../shared/models/newCustomersdata';
import { Registration } from '../../shared/models/registrationdata';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {

  constructor(private auth: AuthenticationService, private router: Router) {}

  customerId: number = 0;   
  firstName: string = '';  
  lastName: string = '';
  emailAddress: string = '';
  phone: string = '';
  passwordClear: string = '';//non è nella classe NewCustomer perché poi quando andrò ad injettare non mi serve

  //HASH e SALT vanno calcolati a partire dalla password in chiaro che viene fornita dall'utente
  passwordHash: string = '';
  passwordSalt: string = '';

  newRegistration: Registration = new Registration; //il nuovo user registrato ha solo la password in chiaro
  newCustomer: NewCustomer = new NewCustomer; //il nuovo customer ha la password Hash e Salt

  Registration(frm: NgForm) {  

    if (frm.valid) {
      // Invia i dati del modulo al server o esegui altre azioni necessarie
      console.log('Form submitted successfully!');
      this.newRegistration = frm.value; //in automatico mi compila i campi del Registration
      console.log(this.newRegistration.emailAddress)

    } else {
      // Mostra un alert o un messaggio di errore appropriato
      alert('Per favore, compila tutti i campi obbligatori correttamente.');
    }
  }

  //Ok- ora ho il mio user con la password in chiaro e devo criptarla - non so se farlo lato back-end
  //dobbiamo decidere
}
