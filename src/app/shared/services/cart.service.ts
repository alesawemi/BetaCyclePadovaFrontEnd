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
import { pWithQuantity } from '../models/cartQuantities';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  email: string = '';
  cartName = '';
  
  userID: number= 0;
  addressID: number = 0;

  //selectedProducts: productSearch[] = [];
  selectedProducts: pWithQuantity[] = [];

  
  constructor(
    private salesOrders: SalesOrderHttp,
    private auth: AuthenticationService, 
    private user: NewUserHttp, 
    private adrs: AddressHttp,
    private http: HttpClient,
    private logtrace: LogtraceService,
    
     )
    
  {
    //Get email from JWT
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
  
  
  
  tempProduct: productSearch = new productSearch; //dummy element : serve per convertire item from view in search product --> in questo modo carrello deve gestire un solo array di selected products/items
  dummyPWithQuantity: pWithQuantity = new pWithQuantity;
  dummyIndex: number = 0;
  
  AddToCart(item: GeneralView) {
    this.itemIntoProduct(item, this.tempProduct);  
    this.AddProductToCart(this.tempProduct);
    this.tempProduct = new productSearch;
  }

  AddProductToCart(product: productSearch) {

    if (this.contains(product.productId)) { 
      this.dummyIndex = this.findIndex(product.productId);
      this.selectedProducts[this.dummyIndex].quantity = 1 + this.selectedProducts[this.dummyIndex].quantity;
    }
    else { 
      this.dummyPWithQuantity.product = product; 
      this.dummyPWithQuantity.id = product.productId;
      this.selectedProducts.push(this.dummyPWithQuantity);
    }

    this.dummyPWithQuantity = new pWithQuantity;
    this.dummyIndex = 0; 
    this.syncCart();
  }

  Add(pq: pWithQuantity) {
    this.AddProductToCart(pq.product);
  }

  

  Remove(product: pWithQuantity) {

    const p_index = this.selectedProducts.indexOf(product);

    if (this.selectedProducts[p_index].quantity>1) { 
      this.selectedProducts[p_index].quantity = this.selectedProducts[p_index].quantity - 1;
      this.total = this.total - this.selectedProducts[p_index].product.listPrice; 
    }
    else if (this.selectedProducts[p_index].quantity==1) {
      this.total = this.total - this.selectedProducts[p_index].product.listPrice;
      this.selectedProducts.splice(p_index,1);
    }

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
      this.total = this.total + element.quantity * (element.product.listPrice);
    })
    this.Count();    
  }

  //#region ORDER AND PAY

  OrderAndPay() {
    
    // Create new SalesOrderHeader
    let newOrderHeader: SalesOrderHeader = {
      salesOrderId: undefined,
      revisionNumber: 2,
      status: 1,  
      onlineOrderFlag: true, 
      salesOrderNumber: 'undefined',  
      purchaseOrderNumber: 'undefined', 
      accountNumber: null,
      customerID: this.userID, 
      shipToAddressID: this.addressID,
      billToAddressID: this.addressID,
      shipMethod: 'CARGO TRANSPORT 5',  
      creditCardApprovalCode: null,
      subTotal: this.total,
      taxAmt: this.total * 0.22,  
      freight: 5.00,  
      totalDue: this.total + (this.total * 0.22) + 5.00,
      comment: null
    };

    console.log(newOrderHeader)

    
   // Create SalesOrderDetails for each item in the cart
   let orderDetails: SalesOrderDetail[] = [];

    // Post the new SalesOrderHeader and get the ID of the created order
    this.salesOrders.PostHeaderFE(newOrderHeader).subscribe({
      next: response => {

        console.log(response.salesOrderId)
            
        this.selectedProducts.forEach(product => {
          let detail: SalesOrderDetail = {
            salesOrderId: response.salesOrderId,
            salesOrderDetailId: undefined,
            // START integrated changes - quantity
            orderQty: product.quantity,  
            productId: product.id,
            unitPrice: product.product.listPrice,
            unitPriceDiscount: 0.00,
            lineTotal: product.product.listPrice *this.selectedProducts.length 
            // END integrated changes - quantity
          };
          orderDetails.push(detail);
        });

     // Debugging log for orderDetails
    console.log("Order Details:", orderDetails);

        this.salesOrders.PostDetailFE(orderDetails).subscribe({
          next: response => {
              // Show a confirmation message to the user
              alert("Ordine effettuato con successo!");
        
              // Empty the cart
              this.selectedProducts = [];
              this.total = 0;
              localStorage.removeItem('cart_'+this.email);
              this.Count(); 
          }
        })

        
      }, 
      
      error: (error: any) => {console.log(error)}});
  }

  //#endregion

  // to convert item from view in product (main Category di product search not in generic item from view)
  itemIntoProduct(item: GeneralView, product: productSearch){
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



  contains(id: number) : boolean {
    let outcome: boolean = false;
    this.selectedProducts.forEach(element => {
      if (element.id == id) { outcome = true; }
    })
    return outcome;
  }

  findIndex(id: number) : number {
    let index: number = 0;
    this.selectedProducts.forEach((element, j) => {
      if (element.id == id) { index = j; }
    })
    return index;
  }


  //#region CHECKOUT COMPONENT
  CheckOut(){

  }
  //#endregion


  //#region  We apologize, this feature is not complete yet
  // CART TO AND FROM DB -- LOGIN FROM MULTIPLE DEVICES -- IN PROGRESS 

  // postCartToDb() {    
  //   console.log("let's try post cart to db")
    
  //   this.selectedProducts.forEach(element => {
  //     let cartToPost: cartDB = new cartDB;
  //     cartToPost.ProductId = element.id;
  //     cartToPost.Quantity = element.quantity;
  //     cartToPost.UserEmail = this.email;
  //     this.PostCartToDb(cartToPost);
  //   })
  // }

  // dbCart: cartDB[] = [];

  // GetCartFromDb(email: string){
  //   this.GetCart(email)
  //   .subscribe({
  //       next: (Data: any) => { 
  //         console.log(Data)
  //         if(Data.$values.length>0) {
  //           this.dbCart = Data.$values.map((item: any) => this.mapToCartDB(item));        
  //           console.log(this.dbCart);
  //         }
  //         else { 
          
  //         }
  //       },
  //       error: (errore: any) => { console.log(errore.message);
  //         // this.fEndError = new LogTrace;
  //         // this.fEndError.Logger = 'error';
  //         // this.fEndError.Message = `An Error Occurred`;
  //         // this.fEndError.Logger = '';
  //         // this.fEndError.Exception = errore.message;
  //         // this.logtrace.PostError(this.fEndError).subscribe({
  //         //   next: (Data: any) => { 
  //         //     console.log('post frontend error to db:'); console.log(Data);
  //         //   },
  //         //   error: (err: any) => {
  //         //     console.log('post frontend error to db:'); console.log(err);
  //         //   }
  //         // })
  //       }
  //     })
  // }

  // PostCartToDb(cart: cartDB){
  //   this.PostCart(cart)
  //   .subscribe({
  //       next: (Data: any) => { console.log(Data); },
  //       error: (errore: any) => { console.log(errore.message);
  //         // this.fEndError = new LogTrace;
  //         // this.fEndError.Logger = 'error';
  //         // this.fEndError.Message = `An Error Occurred`;
  //         // this.fEndError.Logger = '';
  //         // this.fEndError.Exception = errore.message;
  //         // this.logtrace.PostError(this.fEndError).subscribe({
  //         //   next: (Data: any) => { 
  //         //     console.log('post frontend error to db:'); console.log(Data);
  //         //   },
  //         //   error: (err: any) => {
  //         //     console.log('post frontend error to db:'); console.log(err);
  //         //   }
  //         // })
  //       }
  //     })
  // }
  


  // GetCart(email: string): Observable<any>{
  //   return this.http.get(`https://localhost:7228/api/CompleteCart/GetByEmail/${email}`);
  // }

  // PostCart(cart: cartDB): Observable<any>{
  //   return this.http.post(`https://localhost:7228/api/CompleteCart`, cart);
  // }



  // mapToCartDB(item: any): cartDB {
  //   const cartItem = new cartDB();
  //   cartItem.EntryId = item.entryId;
  //   cartItem.UserEmail = item.userEmail;
  //   cartItem.ProductId = item.productId;
  //   cartItem.Quantity = item.quantity;
  //   cartItem.LastUpdateOn = new Date(item.lastUpdateOn);
  //   return cartItem;
  // }
  //#endregion

}
