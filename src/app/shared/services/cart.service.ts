import { Injectable } from '@angular/core';
import { CookieService, SameSite } from 'ngx-cookie-service';
import { GeneralView } from '../models/viewsData';
import { SalesOrderHttp } from './salesOrder.service';
import { productSearch } from '../models/productSearchData';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(salesOrders: SalesOrderHttp, private cookie: CookieService) { } //ho creato un service per gestire gli SalesOrders sia gli Headers che i Details.


  selectedItems: GeneralView[] = [];

  AddToCart(item: GeneralView) {
    this.selectedItems.push(item);
    console.log(this.selectedItems);
  }




  deleteItem: number = 0;

  RemoveItem(item: GeneralView) {
    this.selectedItems.forEach((element, index) => {
      if (element.productId == item.productId) { this.deleteItem = index; } 
    })
    this.selectedItems.splice(this.deleteItem, 1);
    this.total = this.total - this.selectedItems[this.deleteItem].listPrice;
  }



  selectedProduct: productSearch[] = [];

  AddProductToCart(product: productSearch) {
    this.selectedProduct.push(product);
    console.log(this.selectedProduct);
  }

  deleteProduct: number = 0;

  RemoveProduct(product: productSearch) {
    this.selectedProduct.forEach((element, index) => {
      if (element.productId == product.productId) { this.deleteProduct = index; } 
    })
    this.selectedProduct.splice(this.deleteProduct, 1);
    this.total = this.total - this.selectedProduct[this.deleteProduct].listPrice;
  }



  total: number = 0;

  CalculateTotal(){
    console.log(this.total)
    this.selectedItems.forEach(element => {
      this.total = this.total + element.listPrice;
    })
    this.selectedProduct.forEach(element => {
      this.total = this.total + element.listPrice;
    })
  }

  // private name: string = window.btoa("cart_cookie");
  // cart_structure: [ GeneralView[], productSearch[] ] = [ [], [] ]; // ??

  // public setCartCookie(cart_items: GeneralView[], cart_products: productSearch[]){
  //   this.cart_structure[0] = cart_items;
  //   this.cart_structure[1] = cart_products;
  //   //Utilizzo di Cookies      
  //   let expires: Date = new Date();
  //   expires.setDate( expires.getDate() + 30 ); //carrello scade dopo 1 mese
  //   let path: string = "/";
  //   let domain: string = "localhost"
  //   let secure: boolean = true;
  //   let sameSite : SameSite = "Lax" //le opzioni sono "Strict" | "Lax" | "None"

  //   //Parametri del cookie: Name(index)|Value|Domain|Path|Exipers/Max-Age|Size|HttpOnly|Secure!SameSite|Partition Key|Priority
  //   this.cookie.set(
  //     this.name,         //Nome
  //     this.cart_structure.toString(),     // cart_structur (items, products)
  //     expires,      // Data di scadenza (opzionale)
  //     path,         // Percorso (opzionale)
  //     domain,       // Dominio (opzionale)
  //     secure,       // Secure (opzionale)
  //     sameSite,     // SameSite (opzionale)
  //     //partitioned?   // Partizionato (opzionale)
  //   );
  // }
}
