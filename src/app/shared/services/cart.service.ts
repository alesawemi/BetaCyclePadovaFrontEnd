import { Injectable } from '@angular/core';
import { GeneralView } from '../models/viewsData';
import { productSearch } from '../models/productSearchData';
import { SalesOrderDetail } from '../models/salesOrderDetail';
import { SalesOrderHeader } from '../models/salesOrderHeader';
import { NewUserHttp } from './newUserHttp.service';
import { AddressHttp } from './address.service';
import { SalesOrderHttp } from './salesOrder.service';
import { AuthenticationService } from './authentication.service';
import { HttpClient } from '@angular/common/http';
import { LogtraceService } from './logtrace.service';
import { LogTrace } from '../models/LogTraceData';



@Injectable({
  providedIn: 'root'
})
export class CartService {

  email: string = '';
  cartName = '';
  
  userID: number= 0;
  addressID: number = 0;

  selectedProducts: productSearch[] = [];

  //ho creato un service per gestire gli SalesOrders sia gli Headers che i Details. 
  constructor(
    private salesOrders: SalesOrderHttp,
    private auth: AuthenticationService, 
    private user: NewUserHttp, 
    private adrs: AddressHttp,
    private http: HttpClient,
    private logtrace: LogtraceService)   
  {
    //Ottieni l'email dal JWT
    this.email = this.auth.getEmailFromJwt();
    console.log(this.email);

    this.cartName = `cart_${this.email}`;  //useremo window.btoa
    console.log(this.cartName)

    this.user.GetNewCustomerByMail(this.email).subscribe(user => {
      this.userID = user.id;
      console.log(this.userID);
    
      this.adrs.GetAddressCustomerByCustId(this.userID).subscribe(adrsCust => {
        this.addressID = adrsCust.addressId;
        console.log(this.addressID);
      });
    }); 

    this.selectedProducts = JSON.parse(localStorage.getItem(this.cartName) ||'[]');
  }
   


  //fEnd LogTrace
  fEndError: LogTrace = new LogTrace;
  
  
  
  new: productSearch = new productSearch; //dummy element : serve per convertire item from view in search product --> in questo modo carrello deve gestire un solo array di selected products/items
  
  AddToCart(item: GeneralView) {
    this.itemIntoProduct(this.new, item);
    this.selectedProducts.push(this.new);
    this.new = new productSearch;
    this.syncCart();
  }

  AddProductToCart(product: productSearch) {
    this.selectedProducts.push(product);
    this.syncCart();
  }

  

  Remove(product: productSearch) {

    const p_index = this.selectedProducts.indexOf(product);

    if (this.selectedProducts.length>1) { this.total = this.total - this.selectedProducts[p_index].listPrice; }
    else if (this.selectedProducts.length==1) { this.total = 0; }

    this.selectedProducts.splice(p_index,1);
        
    this.syncCart();
  }



  syncCart(){
    localStorage.setItem(this.cartName, JSON.stringify(this.selectedProducts)); 
    this.CalculateTotal();
  }

  

  count: number = 0;

  Count() {
    this.count = this.selectedProducts.length;
  }

  total: number = 0.00;

  CalculateTotal(){
    this.total = 0;
    this.selectedProducts.forEach(element => {
      this.total = this.total + element.listPrice;
    })
    this.Count();
    
  }

  

  OrderAndPay() {
    // Calcola il totale dell'ordine
    // this.CalculateTotal(); // il totale viene già aggiornato automaticamente ogni volta che si aggiungono o tolgono prodotti dal carrello

   

    // Crea un nuovo SalesOrderHeader
    let newOrderHeader: SalesOrderHeader = {
      salesOrderId: undefined,
      revisionNumber: 2,
      status: 1,  // Stato dell'ordine
      onlineOrderFlag: true, // ?
      salesOrderNumber: 'undefined',  //SO+salesOrderID
      purchaseOrderNumber: 'undefined', //PO+salesOrderID
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

    console.log(newOrderHeader)

    
   // Crea SalesOrderDetails per ogni articolo nel carrello
   let orderDetails: SalesOrderDetail[] = [];

    // Posta il nuovo SalesOrderHeader e ottieni l'ID dell'ordine creato
    this.salesOrders.PostHeaderFE(newOrderHeader).subscribe({
      next: response => {

        console.log(response.salesOrderId)
            
        this.selectedProducts.forEach(product => {
          let detail: SalesOrderDetail = {
            salesOrderId: response.salesOrderId,
            salesOrderDetailId: undefined,
            orderQty: this.selectedProducts.length,  // Da integrare con le modifiche di MARTINA
            productId: product.productId,
            unitPrice: product.listPrice,
            unitPriceDiscount: 0.00,
            lineTotal: product.listPrice *this.selectedProducts.length // Da integrare con le modifiche di MARTINA
          };
          orderDetails.push(detail);
        });

     // Debugging log for orderDetails
    console.log("Order Details:", orderDetails);

        this.salesOrders.PostDetailFE(orderDetails).subscribe({
          next: response => {
              // Mostra un messaggio di conferma all'utente
            alert("Ordine effettuato con successo!");
        
            // Svuota il carrello
            this.selectedProducts = [];
            this.total = 0;
            localStorage.removeItem('cart_'+this.email);
          }
        })

        
      }, 
      
      error: (error: any) => {console.log(error)}});
  }



  // per convertire item from view in product (c'è un campo di differenza = main Category di product search che non è presente in generic item from view)
  itemIntoProduct(product: productSearch, item: GeneralView){
    product.productId = item.productId;
    product.productName = item.productName;
    product.color = item.color;
    product.standardCost = item.standardCost;
    product.listPrice = item.listPrice;
    product.size = item.size;
    product.weight = item.weight;
    product.productCategory = item.productCategory;
    product.productModel = item.productModel;
    product.largeImage = item.largeImage;
    product.mainCategory = 'any';  
  }

}
