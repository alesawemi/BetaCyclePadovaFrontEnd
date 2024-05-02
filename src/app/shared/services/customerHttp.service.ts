import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http'; //modulo injectable, 
import { Observable } from 'rxjs';
import { OldCustomers } from '../models/oldCustomersdata';

@Injectable({
    providedIn: 'root'
})

  export class HttprequestService {
    [x: string]: any;

     //ignetto http qui
    constructor(private http: HttpClient) { } 

    private_Url_Old_Customer = `https://localhost:7228`;

    //METODI OLD CUSTOMERS - QUELLI DAL DB ADVENTUREWORKSLITE2019
    //Metodo GET - prendo tutti
    GetOldCustomers() : Observable<any>{
      return this.http.get<OldCustomers>(`${this.private_Url_Old_Customer}/api/OldCustomers`);
    }

    GetOldCustomerById(id: number) : Observable<any>{
      return this.http.get<OldCustomers>(`${this.private_Url_Old_Customer}/api/OldCustomers/${id}`);
    }

    PostOldCustomer(postOldCust: OldCustomers){
      return this.http.post<OldCustomers>(`${this.private_Url_Old_Customer}/api/OldCustomers`, postOldCust);
    }

    UpdateOldCustomerById(id: number, upOldCust: OldCustomers)
    {
      return this.http.put<OldCustomers>(`${this.private_Url_Old_Customer}/api/OldCustomers/${id}`, upOldCust);
    }

    DeleteOldCustomerById(id: number){
      return this.http.delete<OldCustomers>(`${this.private_Url_Old_Customer}/api/OldCustomers/${id}`);
    }
}