import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LogtraceService } from '../../../shared/services/logtrace.service';
import { LogTrace } from '../../../shared/models/LogTraceData';
import { productSearch } from '../../../shared/models/productSearchData';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';


@Component({
  selector: 'app-update-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './update-product.component.html',
  styleUrl: './update-product.component.css'
})
export class UpdateProductComponent {

  updateId: number = 0; // To store the entered product ID
  productInfo: productSearch = new productSearch; // To store the product information

  constructor (private http: HttpClient, private logtrace: LogtraceService) 
  { }

  //fEnd LogTrace
  fEndError: LogTrace = new LogTrace;

  getProductInfo(id: HTMLInputElement) {
    this.updateId=parseInt(id.value)
    // Find the product in allProducts array based on productId
    this.GetProductById(this.updateId).subscribe({
      next: (Data:any) => {
        console.log(Data);
        this.productInfo.productId = Data.productId;
        this.productInfo.color = Data.color;
        this.productInfo.listPrice = Data.listPrice;
        this.productInfo.productName = Data.name;
        this.productInfo.size = Data.size;
        this.productInfo.weight = Data.weight; 
      },
      error: (err:any) => {
        console.log(err)
      }
    })
    console.log(this.productInfo)
  }

  

  bikes: boolean = false;
  components: boolean = false;
  accessories: boolean = false;
  clothing: boolean = false;

  Filters(event: any) {

    if (event.target.checked) {
      if (this.bikes) { 
        this.allProducts = this.allProducts.filter(p => p.mainCategory == 'Bikes') 
      }
      if (this.components) { 
        this.allProducts = this.allProducts.filter(p => p.mainCategory == 'Components') 
      }
      if (this.accessories) { 
        this.allProducts = this.allProducts.filter(p => p.mainCategory == 'Accessories') 
      }
      if (this.clothing) { 
        this.allProducts = this.allProducts.filter(p => p.mainCategory == 'Clothing') 
      }
    } 
    else {
      this.allProducts = this.products;
    }
  }

  ngOnInit() {
    this.ShowAll();    
  }


  allProducts: productSearch[] = [];
  products: productSearch[] = [];

  ShowAll() {
    this.GetAll().subscribe({
      next: (Data: any) => {
        if(Data.$values.length>0) {
          this.allProducts=Data.$values;
          this.allProducts.forEach(p => { 
            switch(p.mainCategoryID) {
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
          })  
          console.log(this.allProducts)
          this.products = this.allProducts;
        }
      },
      error: (errore: any) => {
        this.fEndError = new LogTrace;
        this.fEndError.Level = 'error';
        this.fEndError.Message = 'An Error Occurred in ShowAll';
        this.fEndError.Logger = 'uptade-product component';
        this.fEndError.Exception = errore.message;
        this.logtrace.PostError(this.fEndError).subscribe({
          next: (Data: any) => { 
            console.log('post frontend error to db:'); console.log(Data);
          },
          error: (err: any) => {
            console.log('post frontend error to db:'); console.log(err);
          }
        })
      }
    })
  }

  GetAll(): Observable<any>{
    return this.http.get(`https://localhost:7228/api/ProductsView`);
  }

  GetProductById(id: number): Observable<any>{
    return this.http.get(`https://localhost:7228/api/Products/${id}`)
  }

  // PostProduct(id: number): Observable<any>{
  //   return this.http.put(`https://localhost:7228/api/Products/${id}`, this.modified)
  // }
}
