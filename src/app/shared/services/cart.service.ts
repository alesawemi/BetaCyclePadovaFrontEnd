import { Injectable } from '@angular/core';
import { CookieService, SameSite } from 'ngx-cookie-service';
import { GeneralView } from '../models/viewsData';
import { SalesOrderHttp } from './salesOrder.service';
import { productSearch } from '../models/productSearchData';
import { SalesOrderDetail } from '../models/salesOrderDetail';
import { SalesOrderHeader } from '../models/salesOrderHeader';
import { AuthenticationService } from './authentication.service';
import { NewUserHttp } from './newUserHttp.service';
import { AddressHttp } from './address.service';
import { AddressCustomer } from '../models/addressData';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  
  userID: number= 0;
  addressID: number = 0;
  
  constructor(private salesOrders: SalesOrderHttp, private cookie: CookieService
    ,private auth: AuthenticationService, private user: NewUserHttp, private adrs: AddressHttp
  ) {// Ottieni l'email dal JWT
    const email = this.auth.getEmailFromJwt();

    this.user.GetNewCustomerByMail(email).subscribe(user => {
      this.userID = user.id;
      console.log(this.userID);
    
      this.adrs.GetAddressCustomerByCustId(this.userID).subscribe(adrsCust => {
        this.addressID = adrsCust.addressId;
        console.log(this.addressID);
      });
    }); } //ho creato un service per gestire gli SalesOrders sia gli Headers che i Details.


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


  

  OrderAndPay(): void {
    // Calcola il totale dell'ordine
    this.CalculateTotal();
  
    
    

    // Crea un nuovo SalesOrderHeader
    let newOrderHeader: SalesOrderHeader = {
      salesOrderID: undefined,
      revisionNumber: 2,
      orderDate: new Date(),
      dueDate: new Date(new Date().setDate(new Date().getDate() + 12)),  // Imposta una data di scadenza appropriata
      shipDate: new Date(new Date().setDate(new Date().getDate() + 7)),  // La data di spedizione può essere impostata in seguito
      status: 1,  // Stato dell'ordine
      onlineOrderFlag: false,
      salesOrderNumber: undefined,  //SO+salesOrderID
      purchaseOrderNumber: undefined, //PO+salesOrderID
      accountNumber: null,
      customerID: this.userID,  // Imposta l'ID del cliente appropriato
      shipToAddressID: this.addressID,
      billToAddressID: this.addressID,
      shipMethod: 'CARGO TRANSPORT 5',  // Imposta il metodo di spedizione appropriato
      creditCardApprovalCode: null,
      subTotal: this.total,
      taxAmt: this.total * 0.22,  // Esempio: IVA al 22%
      freight: 5.00,  // Esempio: costo di spedizione fisso
      totalDue: this.total + (this.total * 0.22) + 5.00,
      comment: null
    };
  
    // Posta il nuovo SalesOrderHeader e ottieni l'ID dell'ordine creato
    this.salesOrders.PostHeader(newOrderHeader).subscribe(response => {
      const createdOrderID = response.salesOrderID;
  
      // Crea SalesOrderDetails per ogni articolo nel carrello
      let orderDetails: SalesOrderDetail[] = [];
  
      this.selectedItems.forEach(item => {
        let detail: SalesOrderDetail = {
          salesOrderID: createdOrderID,
          salesOrderDetailID: undefined, //lo mette in automatico il db
          orderQty: this.selectedItems.length,  // vado a leggere la quantità dalla lista?
          productID: item.productId,
          unitPrice: item.listPrice,
          unitPriceDiscount: 0.00,
          lineTotal: item.listPrice  // Imposta il totale della riga appropriato
        };
        orderDetails.push(detail);
      });
  
      this.selectedProduct.forEach(product => {
        let detail: SalesOrderDetail = {
          salesOrderID: createdOrderID,
          salesOrderDetailID: undefined,
          orderQty: this.selectedProduct.length,  // Imposta la quantità appropriata
          productID: product.productId,
          unitPrice: product.listPrice,
          unitPriceDiscount: 0.00,
          lineTotal: product.listPrice  // Imposta il totale della riga appropriato
        };
        orderDetails.push(detail);
      });
  
      // Posta ogni SalesOrderDetail al server
      orderDetails.forEach(detail => {
        this.salesOrders.PostDetail(detail).subscribe(response => {
          console.log("Order detail posted successfully:", response);
        });
      });
  
      // Mostra un messaggio di conferma all'utente
      alert("Ordine effettuato con successo!");
  
      // Svuota il carrello
      this.selectedItems = [];
      this.selectedProduct = [];
      this.total = 0;
    });
  }
  
}
