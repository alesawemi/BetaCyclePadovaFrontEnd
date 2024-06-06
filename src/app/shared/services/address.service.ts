import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http'; //modulo injectable, 
import { Observable } from 'rxjs';
import { Address, AddressCustomer } from '../models/addressData';

@Injectable({
    providedIn: 'root'
})

  export class AddressHttp {
    [x: string]: any;

    constructor(private http: HttpClient) { } 

    private_Url_Address = `https://localhost:7228/api/Addresses`;
    private_Url_Address_Customer = `https://localhost:7228/api/CustomerAddresses`;

    //#region ADDRESS
    GetAddress() : Observable<any>{
      return this.http.get<Address>(`${this.private_Url_Address}`);
    }

    GetAddressById(id: number) : Observable<any>{
      return this.http.get<Address>(`${this.private_Url_Address}/${id}`);
    }

    PostAddress(postAddress: Address){
      return this.http.post<Address>(`${this.private_Url_Address}`, postAddress);
    }

    UpdateAddressById(id: number, updAddress: Address)
    {
      return this.http.put<Address>(`${this.private_Url_Address}/${id}`, updAddress);
    }

    UpdateAddressByadrsId(id: number, updAddress: Address)
    {
      return this.http.put<Address>(`${this.private_Url_Address}/FrontEnd/${id}`, updAddress);
    }

    DeleteAddressById(id: number){
      return this.http.delete<Address>(`${this.private_Url_Address}/${id}`);
    }
    //#endregion

    //#region  ADDRESS - CUSTOMER
    GetAddressCustomerByCustId(id: number) : Observable<any>{
        return this.http.get<AddressCustomer>(`${this.private_Url_Address_Customer}/Customer/${id}`);
    }

    GetAddressCustomerByAdrsId(id: number) : Observable<any>{
        return this.http.get<AddressCustomer>(`${this.private_Url_Address_Customer}/Address/${id}`);
    }

    PostAddressCustomer(postAddressCustomer: AddressCustomer){
        return this.http.post<AddressCustomer>(`${this.private_Url_Address_Customer}/FrontEnd`, postAddressCustomer);
    }

    UpdateAddressCustomerById(id: number, updAddressCustomer: AddressCustomer)
    {
      return this.http.put<AddressCustomer>(`${this.private_Url_Address_Customer}/${id}`, updAddressCustomer);
    }

    UpdateAddressCustomerByCustId(id: number, updAddressCustomer: AddressCustomer)
    {
        return this.http.put<AddressCustomer>(`${this.private_Url_Address_Customer}/Customer/${id}`, updAddressCustomer)
    }
    //#endregion
  }