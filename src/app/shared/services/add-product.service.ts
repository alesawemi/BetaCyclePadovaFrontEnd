import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AddProduct } from '../models/product';
import { Observable } from 'rxjs';
import { CategoryNameParent } from '../models/ProductCategory';
import { AuthenticationService } from './authentication.service';


@Injectable({
  providedIn: 'root'
})
export class AddProductService {

  constructor(private http: HttpClient, private auth: AuthenticationService) { }

  private private_Url = `https://localhost:7228/api/Products`;
  private private_GetNameParent = `https://localhost:7228/api/ProductCategories/GetNameParent`

//Post use for add the product
PostAdd(addProduct: AddProduct) : Observable<any> {
  return this.http.post(`${this.private_Url}`,addProduct, { headers: this.auth.authHeader})
}

//Get use for to have the Category, ParentId and Name 
GetCategoryTot() :Observable<CategoryNameParent[]>{
return this.http.get<CategoryNameParent[]>(`${this.private_GetNameParent}`)
}

}
