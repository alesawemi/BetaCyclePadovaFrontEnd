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
import { Route, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  email: string = '';
  cartName = '';
  
  userID: number= 0;
  addressID: number = 0;

  //model class to associate each product added to the cart with the corresponding added quantity
  selectedProducts: pWithQuantity[] = [];

  
  constructor(
    private salesOrders: SalesOrderHttp,
    private auth: AuthenticationService, 
    private user: NewUserHttp, 
    private adrs: AddressHttp,
    private http: HttpClient,
    private logtrace: LogtraceService,
    private router: Router
    
  )
    
  {
    //Get email from JWT
    this.email = this.auth.getEmailFromJwt();
    console.log(this.email);

    this.cartName = `cart_${this.email}`;  
    console.log(this.cartName)

    //we'll need the address of the customer to complete the order
    this.user.GetNewCustomerByMail(this.email).subscribe(user => {
      this.userID = user.id;
      console.log(this.userID);
    
      this.adrs.GetAddressCustomerByCustId(this.userID).subscribe(adrsCust => {
        this.addressID = adrsCust.addressId;
        console.log(this.addressID);
      });
    }); 

    // initialize cart with info in LocalStorage associated with this user
    this.selectedProducts = JSON.parse(localStorage.getItem(this.cartName) ||'[]');
  }
   


  //fEnd LogTrace
  fEndError: LogTrace = new LogTrace;
  
  
  //#region CART
  //dummy element : convert item from genericView into Product 
  tempProduct: productSearch = new productSearch; 
  //dummy to fill in and add to array of selectedProducts
  dummyPWithQuantity: pWithQuantity = new pWithQuantity;
  dummyIndex: number = 0;
  
  AddToCart(item: GeneralView) { //Add to cart from Views
    this.itemIntoProduct(item, this.tempProduct);  
    this.AddProductToCart(this.tempProduct);
    this.tempProduct = new productSearch;
  }

  AddProductToCart(product: productSearch) { //Add to cart from product search bar
    //if product to add already exists in the cart increase the corresponding quantity
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

  Add(pq: pWithQuantity) { //when '+' button is clicked in the cart to increase the quantity of a chosen product
    this.AddProductToCart(pq.product);
  }

  

  Remove(product: pWithQuantity) {

    const p_index = this.selectedProducts.indexOf(product);

    //if quantity of product to remove is > 1 decrease quantity 
    if (this.selectedProducts[p_index].quantity>1) { 
      this.selectedProducts[p_index].quantity = this.selectedProducts[p_index].quantity - 1;
      this.total = this.total - this.selectedProducts[p_index].product.listPrice; 
    } 
    //if quantity of product to remove is = 1 remove product
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
  //#endregion
  

  
  //#region total
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
  //#endregion

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
              this.router.navigate(['home']); // Redirect to home
          }
        })

        
      }, 
      
      error: (error: any) => {
        console.log(error)
        this.fEndError = new LogTrace();
        this.fEndError.Level = 'error';
        this.fEndError.Message = 'An Error Occurred in OrderAndPay';
        this.fEndError.Logger = 'cart-service';
        this.fEndError.Exception = error.message;
        this.logtrace.PostError(this.fEndError).subscribe({
          next: (Data: any) => { 
            console.log('post frontend error to db:'); console.log(Data);
          },
          error: (err: any) => {
            console.log('post frontend error to db:'); console.log(err);
          }
        });
        alert("An unexpected error occurred. Please try again later. Our support team has been notified of the issue.")
        this.router.navigate(['home']); // Redirect to home
      }
    });
  }

  //#endregion


  //#region useful methods

  // to convert item from genericView in productSearch (main Category not present in item)
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

  //check if a product is already selected
  contains(id: number) : boolean {
    let outcome: boolean = false;
    this.selectedProducts.forEach(element => {
      if (element.id == id) { outcome = true; }
    })
    return outcome;
  }

  //find index of a given id in the array of selected products
  findIndex(id: number) : number {
    let index: number = 0;
    this.selectedProducts.forEach((element, j) => {
      if (element.id == id) { index = j; }
    })
    return index;
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
