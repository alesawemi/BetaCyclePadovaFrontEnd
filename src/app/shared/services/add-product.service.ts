import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AddProduct } from '../models/product';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddProductService {

  constructor(private http: HttpClient) { }

  private private_Url = `https://localhost:7228/api/Products`;

PostAdd(addProduct: AddProduct) : Observable<any> {
  return this.http.post(`${this.private_Url}`,addProduct)
}


}
