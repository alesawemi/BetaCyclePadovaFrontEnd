import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LogtraceService } from '../../../shared/services/logtrace.service';
import { LogTrace } from '../../../shared/models/LogTraceData';
import { productSearch } from '../../../shared/models/productSearchData';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { dbProduct } from '../../../shared/models/product';
import { AuthenticationService } from '../../../shared/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css']
})
export class UpdateProductComponent {

  

  //fEnd LogTrace
  fEndError: LogTrace = new LogTrace();  

  constructor(private http: HttpClient, private logtrace: LogtraceService, 
    private router: Router, private auth: AuthenticationService) { }

  ngOnInit() {
    //show all editable products
    this.ShowAll();    
  }  


  //#region loading icon
  isLoading: boolean = false; // Variable for "loading" icon
  isPageLoading() {
    return this.isLoading;
  }
//#endregion


  //#region Show All Products
  allProducts: productSearch[] = [];
  products: productSearch[] = [];

  ShowAll() {
    this.isLoading = true
    this.GetAll().subscribe({
      next: (Data: any) => {
        if (Data.$values.length > 0) {
          this.allProducts = Data.$values;
          this.allProducts.forEach(p => { 
            switch (p.mainCategoryID) {
              case 1:
                p.mainCategory = 'Bikes';
                break;
              case 2: 
                p.mainCategory = 'Components';
                break;
              case 3:
                p.mainCategory = 'Clothing';
                break;
              case 4: 
                p.mainCategory = 'Accessories';
                break;
            }  
          });
          console.log(this.allProducts);
          this.products = this.allProducts;
          this.isLoading = false
        }
      },
      error: (errore: any) => {
        this.fEndError = new LogTrace();
        this.fEndError.Level = 'error';
        this.fEndError.Message = 'An Error Occurred in ShowAll';
        this.fEndError.Logger = 'update-product component';
        this.fEndError.Exception = errore.message;
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



  //#region Filter the product list by Category
  bikes: boolean = false;
  components: boolean = false;
  accessories: boolean = false;
  clothing: boolean = false;

  //select macro category to show
  Filters(event: any) {
    if (event.target.checked) {
      if (this.bikes) { 
        this.allProducts = this.allProducts.filter(p => p.mainCategory == 'Bikes'); 
      }
      if (this.components) { 
        this.allProducts = this.allProducts.filter(p => p.mainCategory == 'Components'); 
      }
      if (this.accessories) { 
        this.allProducts = this.allProducts.filter(p => p.mainCategory == 'Accessories'); 
      }
      if (this.clothing) { 
        this.allProducts = this.allProducts.filter(p => p.mainCategory == 'Clothing'); 
      }
    } else {
      this.allProducts = this.products;
    }
  } 
  //#endregion



  //#region Variables for edit/delete
  updateId: number = 0; //productId to update
  productInfo: dbProduct = new dbProduct(); //store info from the DB
  inputId: number = 0; //bind the input value
  pUpdate: dbProduct = new dbProduct(); //edited product

  //reset all the values
  reset() {
    this.productInfo = new dbProduct();
    this.updateId = 0;
    this.inputId = 0; 
  }
  //#endregion


  //#region Recap selected Id 
  Show() {
    this.updateId = this.inputId;
    //get complete product from the DB
    this.GetProductById(this.updateId).subscribe({
      next: (Data: any) => {
        console.log(Data);
        this.productInfo = Data;
      },
      error: (err: any) => {
        this.fEndError = new LogTrace();
        this.fEndError.Level = 'error';
        this.fEndError.Message = 'An Error Occurred in Show/Recap';
        this.fEndError.Logger = 'update-product component';
        this.fEndError.Exception = err.message;
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
    console.log(this.productInfo);    
  }
  //#endregion
  

  //#region Edit
  Edit(updateName: HTMLInputElement, updateColor: HTMLInputElement, updatePrice: HTMLInputElement, 
    updateSize: HTMLInputElement, updateWeight: HTMLInputElement) {
    
    //copy the structure of the product from the DB in the updated product
    this.pUpdate = this.productInfo;
    
    //edit only the properties that have been modified in the input
    if (updateName && updateName.value.trim() !== '') {
      this.pUpdate.name = updateName.value.trim();
    }
    if (updateColor && updateColor.value.trim() !== '') {
      this.pUpdate.color = updateColor.value.trim();
    }
    if (updateSize && updateSize.value.trim() !== '') {
      this.pUpdate.size = updateSize.value.trim();
    }
    if (updatePrice && updatePrice.value.trim() !== '') {
      this.pUpdate.listPrice = parseInt(updatePrice.value.trim());
    }
    if (updateWeight && updateWeight.value.trim() !== '') {
      this.pUpdate.weight = parseInt(updateWeight.value.trim());
    }
    console.log(this.pUpdate);
    this.isLoading = true
    //send updated product to the db
    this.PutProduct(this.pUpdate.productId, this.pUpdate).subscribe({
      next: (response: any) => {
        this.isLoading = false
        this.reset();
        alert("Product Successfully Updated");
      },
      error: (err: any) => {
        this.reset()
        this.fEndError = new LogTrace();
        this.fEndError.Level = 'error';
        this.fEndError.Message = 'An Error Occurred in Edit/PutProduct';
        this.fEndError.Logger = 'update-product component';
        this.fEndError.Exception = err.message;
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

  
//#region Delete
  Delete() {
    let indexD = this.inputId;
    this.isLoading = true
    this.DeleteProduct(indexD).subscribe({
      next: (response: any) => {
        this.isLoading = false
        this.reset();
        alert("Product Successfully Deleted");
      },
      error: (err: any) => {
        this.reset();
        this.fEndError = new LogTrace();
        this.fEndError.Level = 'error';
        this.fEndError.Message = 'An Error Occurred in Delete';
        this.fEndError.Logger = 'update-product component';
        this.fEndError.Exception = err.message;
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
  

  
//#region Http calls with observables
  GetAll(): Observable<any> {
    return this.http.get(`https://localhost:7228/api/ProductsView`);
  }

  GetProductById(id: number): Observable<any> {
    return this.http.get(`https://localhost:7228/api/Products/${id}`);
  }

  PutProduct(id: number, up: dbProduct): Observable<any> {
    return this.http.put(`https://localhost:7228/api/Products/${id}`, up, { headers: this.auth.authHeader});
  }

  DeleteProduct(id: number): Observable<any> {
    return this.http.delete(`https://localhost:7228/api/Products/${id}`, { headers: this.auth.authHeader});
  }
  //#endregion

}
