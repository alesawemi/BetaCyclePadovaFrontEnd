import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http'; //modulo injectable, 
import { Observable } from 'rxjs';
import { Registration } from '../models/registrationdata';
import { NewCustomer } from '../models/newCustomersdata';

@Injectable({
    providedIn: 'root'
})

  export class NewUserHttp {
    [x: string]: any;

     //ignetto http qui
    constructor(private http: HttpClient) { } 

    private_Url_New_Customer = `https://localhost:7228`;

    //METODI NEW USER - QUELLI DAL DB USERS
    //Metodo GET - prendo tutti
    GetNewCustomer() : Observable<any>{
      return this.http.get<NewCustomer>(`${this.private_Url_New_Customer}/api/Users`);
    }

    GetNewCustomerrById(id: number) : Observable<any>{
      return this.http.get<NewCustomer>(`${this.private_Url_New_Customer}/api/Users/${id}`);
    }

    PostNewCustomer(postNewCust: NewCustomer){
      return this.http.post<NewCustomer>(`${this.private_Url_New_Customer}/api/Users`, postNewCust);
    }

    UpdateNewCustomerById(id: number, upNewCust: NewCustomer)
    {
      return this.http.put<NewCustomer>(`${this.private_Url_New_Customer}/api/Users/${id}`, upNewCust);
    }

    DeleteNewCustomerById(id: number){
      return this.http.delete<NewCustomer>(`${this.private_Url_New_Customer}/api/Users/${id}`);
    }

    //Registration - devo mandare al backend le info con la password in chiaro
    PostNewRegistration(postNewRegistr: Registration){
        return this.http.post<Registration>(`${this.private_Url_New_Customer}/api/Users/Registration`, postNewRegistr);
    }
}