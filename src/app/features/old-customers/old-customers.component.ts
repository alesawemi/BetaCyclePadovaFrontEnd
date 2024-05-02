import { Component } from '@angular/core';
import { HttprequestService } from '../../shared/services/customerHttp.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OldCustomers } from '../../shared/models/oldCustomersdata';

@Component({
  selector: 'app-old-customers',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './old-customers.component.html',
  styleUrl: './old-customers.component.css'
})
export class OldCustomersComponent {

  allOldCustomers: OldCustomers[] = [];
  oneOldCustomer: OldCustomers = new OldCustomers;
  id : number = 1;


  constructor(private mainHttp: HttprequestService)
  {
    this.GetAll();
  }
  
  GetAll(){
    this.mainHttp.GetOldCustomers()
    .subscribe({
      next: (jsData: any) => {
          this.allOldCustomers = jsData
          console.log(this.allOldCustomers)
      },
      error: (erreur: any) => {
        console.log(erreur)
      }
    })
  }

  InsertId(index: NgForm){
    this.id= index.value.id;
    this.GetOldCustomer_ById();
  }

  GetOldCustomer_ById(){
    this.mainHttp.GetOldCustomerById(this.id)
    .subscribe({
      next: (jsData: any) => {
          this.oneOldCustomer = jsData
          console.log(this.oneOldCustomer)
      },
      error: (erreur: any) => {
        console.log(erreur)
      }
    })
  }
 
}
