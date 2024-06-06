import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Address, AddressCustomer } from '../../shared/models/addressData';
import { NewUserHttp } from '../../shared/services/newUserHttp.service';
import { LoginHttpService } from '../../shared/services/loginHttp.service';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { NewCustomer } from '../../shared/models/newCustomersdata';
import { AddressHttp } from '../../shared/services/address.service';
import { LogtraceService } from '../../shared/services/logtrace.service';
import { LogTrace } from '../../shared/models/LogTraceData';
import { CartService } from '../../shared/services/cart.service';
import { pWithQuantity } from '../../shared/models/cartQuantities';

@Component({
  selector: 'app-cart-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cart-checkout.component.html',
  styleUrl: './cart-checkout.component.css'
})
export class CartCheckoutComponent implements OnInit {
  profileForm!: FormGroup;
  addressForm!: FormGroup;
  found: boolean = false;
  email: string = '';
  updId: number = 0;
  adrsId: number = 0;

  isLoading: boolean = false; // Variabile di stato per il caricamento


  orderedProducts: pWithQuantity[] = [];
  subtotal: number = 0;
  shippingCost: number = 0;
  total: number = 0;

  // Per avere i valori sempre aggiornati nel form
  originalProfileValues: any;
  originalAddressValues: any;
  originalProfileData: any;
  originalAddressData: any;

  constructor(
    private fb: FormBuilder,
    private newUserHttp: NewUserHttp,
    private loginHttp: LoginHttpService,
    private auth: AuthenticationService,
    private adrs: AddressHttp,
    private cartService: CartService,
    private logtrace: LogtraceService // per gestione errori centralizzata
  ) {}

  //fEnd LogTrace
  fEndError: LogTrace = new LogTrace;

  //quando la pagina viene inizializzata compie le seguenti operazioni
  ngOnInit(): void {
    this.initForms(); //imposta i Validator dei vari campi form
    this.loadData(); //carico i dati che ci sono nel database

    this.getCartDetails()
    
  }
//#region Edit My Information
  initForms() {
    this.profileForm = this.fb.group({
      email: [this.email],
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      surname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      phone: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(20)]]
    });

    this.addressForm = this.fb.group({
      addressLine1: ['', Validators.required],
      addressLine2: ['', Validators.required],
      city: ['', Validators.required],
      stateProvince: ['', Validators.required],
      countryRegion: ['', Validators.required],
      postalCode: ['', Validators.required],
      addressType: ['', Validators.required]
    });
  }

  loadData() { 
    this.isLoading = true
    this.email = this.auth.getEmailFromJwt();
    console.log('email: ' + this.email)

    if (this.email.length > 0) {
      this.newUserHttp.GetNewCustomerByMail(this.email).subscribe((user: NewCustomer) => {
        if (user) {
          this.updId = user.id;
          this.setUserPlaceholder(user.mail, user.name, user.surname, user.phone);
          this.originalProfileValues = this.profileForm.getRawValue();

          this.adrs.GetAddressCustomerByCustId(this.updId).subscribe((ac: AddressCustomer) => {
            this.adrsId = ac.addressId;
            this.adrs.GetAddressById(this.adrsId).subscribe((a: Address) => {
              this.found = true;
              this.setAddressPlaceholder(a.addressLine1, a.addressLine2, a.city, a.stateProvince, a.countryRegion, a.postalCode, ac.addressType);
              this.originalAddressValues = this.addressForm.getRawValue();
            });
          }, error => {
            this.setAddressPlaceholder('','','','','','','');
            this.found = false;
          });
          this.isLoading = false
        }
      }, error => {
        console.error('Error fetching user:', error);
      });
    }
  }

  isPageLoading() {
    return this.isLoading;
  }
  
  setUserPlaceholder(email: string, firstName: string, lastName: string, phone: string) {
    // Imposta i placeholder per i campi del form
    this.profileForm.patchValue({
      email: email,
      name: firstName ? firstName : '',
      surname: lastName ? lastName : '',
      phone: phone ? phone : ''
    });
  }

  setAddressPlaceholder(addressLine1: string, addressLine2: string, city: string, stateProvince: string, countryRegion: string, postalCode: string, addressType: string){
    this.addressForm.patchValue({
      addressLine1: addressLine1 ? addressLine1: '',
      addressLine2: addressLine2 ? addressLine2: '',
      city: city ? city: '',
      stateProvince: stateProvince ? stateProvince: '',
      countryRegion: countryRegion ? countryRegion: '',
      postalCode: postalCode ? postalCode: '',
      addressType: addressType ? addressType: ''
    })
  }

  //#region UPDATE USER DATA
  UpdUser : NewCustomer = new NewCustomer();
  frmvalues: any;
  //richiamo il metodo quando faccio il submit della form "profileForm"
  updateUser() {
    if (this.profileForm.valid) {
      this.frmvalues = this.profileForm.getRawValue();
      this.UpdUser.id = this.updId;
      this.UpdUser.mail = this.email;
      this.UpdUser.name = this.frmvalues.name;
      this.UpdUser.surname = this.frmvalues.surname;
      this.UpdUser.phone = this.frmvalues.phone;
      console.log(this.UpdUser.phone)
      this.newUserHttp.UpdateNewCustomerById(this.updId, this.UpdUser).subscribe((response: any) => {
        alert('User updated successfully')
        this.cancelProfileChanges()
        console.log('User updated', response);
      });
    }
  }
  //#endregion

//#region ADDRESS
  address: Address = new Address();
  addressCust : AddressCustomer = new AddressCustomer();
  //richiamo il metodo quando faccio il submit della form "addressForm"
  updateAddress() {
    
    if (this.addressForm.valid) {

      const postAddress = this.addressForm.value;
      
      this.address.addressId = this.adrsId;
      this.address.addressLine1 = this.addressForm.value.addressLine1;
      this.address.addressLine2 = this.addressForm.value.addressLine2;
      this.address.city = this.addressForm.value.city;
      this.address.countryRegion = this.addressForm.value.countryRegion;
      this.address.stateProvince = this.addressForm.value.stateProvince;
      this.address.postalCode = this.addressForm.value.postalCode;

      if(this.found){ //se esiste già un indirizzo gli faccio fare l'update - consideriamo i vecchi utenti di cui non conosciamo le psw
        console.log('Sei entrato nel update');
        this.addressCust.customerId = this.updId;
        this.addressCust.addressId = this.adrsId;
        this.addressCust.addressType = this.addressForm.value.addressType;

        this.adrs.UpdateAddressCustomerByCustId(this.updId, this.addressCust).subscribe((respone: any) => {
            //alert('Address Customer - Type updated'); console.log(respone);
          this.adrs.UpdateAddressByadrsId(this.adrsId, this.address).subscribe((respons: any) => {
            //alert('Address updated'); console.log('Address updated', respons); 
            alert('Address Updated successfully')
            this.cancelAddressChanges(); // Segna il form come non modificato        
          });
        });        
      }
      else{ //se è la prima volta che inserisco i dati degli address è logicamente giusto fare un post
        this.adrs.PostAddress(postAddress).subscribe((a: Address) => {
          //alert('Address posted');
          
          //devo fare un post anche sulla tabella condivisa da Customer/Users e Address
       
          this.addressCust.customerId = this.updId;
          this.addressCust.addressId = a.addressId;
          this.addressCust.addressType = this.addressForm.value.addressType;

          this.adrs.PostAddressCustomer(this.addressCust).subscribe((response: any) => {
            //alert('Address - Customer posted');
            alert('Address Updated successfully')

            //disabilitare il pulsante update - perché l'ho appena fatto
            this.cancelAddressChanges(); // Segna il form come non modificato 

          })
        })
      }
      

    }
  }

//#endregion


cancelProfileChanges() {
  this.loadData();
  this.profileForm.markAsPristine(); // Segna il form come non modificato
}

cancelAddressChanges() {
  this.loadData();
  this.addressForm.markAsPristine(); // Segna il form come non modificato
}

//#endregion



//#region COMPLETE ORDER AND PAY

FinishOrder(){
  this.cartService.OrderAndPay()
  
}


getCartDetails() {
  this.orderedProducts = this.cartService.selectedProducts;
  this.subtotal = this.cartService.total;
  // Puoi impostare il costo di spedizione in base alla tua logica di business
  this.shippingCost = 4.00;
  this.total = this.subtotal + this.shippingCost;
}

//#endregion
}


