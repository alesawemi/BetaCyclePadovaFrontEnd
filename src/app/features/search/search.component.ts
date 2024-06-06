import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { productSearch } from '../../shared/models/productSearchData';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { LogtraceService } from '../../shared/services/logtrace.service';
import { LogTrace } from '../../shared/models/LogTraceData';
import { CartService } from '../../shared/services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})

export class SearchComponent {

  constructor(private route: ActivatedRoute, private http: HttpClient, public cart: CartService,
    private logtrace: LogtraceService, private router: Router) {}

  //fEnd LogTrace
  fEndError: LogTrace = new LogTrace;

  searchParameter: string = '';  

  filteredResult: productSearch[] = [];

  SearchByParam() {
    this.GetByParam(this.searchParameter)
      .subscribe({
        next: (Data: any) => { 
          if (Data.$values.length>0) { 
            this.filteredResult = Data.$values; 
            this.filteredResult.forEach(element => { 
              switch(element.mainCategoryID) { //set string of main category based on its ID
                case 1:
                  element.mainCategory = 'Bikes';
                  break;
                case 2: 
                  element.mainCategory = 'Components';
                  break;
                case 3:
                  element.mainCategory = 'Clothing';
                  break;
                case 4: 
                  element.mainCategory = 'Accessories';
                  break;
              }    
              element.largeImage = `data:image/png;base64, ${element.largeImage}`; 
              if (element.color == null) element.color = 'altro';
              if (element.size == null) element.size = 'altro';

            });
          } 
          else { 
            alert("We are sorry, there are currently no products that match these search parameters. " +
              "Please consider modifying the filters");              
           }   
        },          
        error: (errore: any) => {
          this.fEndError = new LogTrace;
          this.fEndError.Level = 'error';
          this.fEndError.Message = 'An Error Occurred in SearchByParam';
          this.fEndError.Logger = 'SearchComponent';
          this.fEndError.Exception = errore.message;
          this.logtrace.PostError(this.fEndError).subscribe({
            next: (Data: any) => { 
              console.log('post frontend error to db:'); console.log(Data);
            },
            error: (err: any) => {
              console.log('post frontend error to db:'); console.log(err);
            }
          })
          alert("An unexpected error occurred. Please try again later. Our support team has been notified of the issue.")
          this.router.navigate(['home']); // Redirect to home
        }
      })
  }



  ngOnInit() {
    this.route.queryParams.subscribe(params => { //get search parameter from search bar (@navbar)
      this.searchParameter = params['param'];
      this.SearchByParam();
    });
  }
  


  GetByParam(parameter: string): Observable<any>{
    return this.http.get(`https://localhost:7228/api/ProductsView/GetByParam/${parameter}`);
  }

}
