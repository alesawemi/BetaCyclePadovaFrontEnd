import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { productSearch } from '../../shared/models/productSearchData';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { LogtraceService } from '../../shared/services/logtrace.service';
import { LogTrace } from '../../shared/models/LogTraceData';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})

export class SearchComponent {

  constructor(private route: ActivatedRoute, private http: HttpClient, private logtrace: LogtraceService) {}

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
              switch(element.mainCategoryID) {
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
            alert("Siamo spiacenti, " +
              "al momento non sono presenti prodotti che soddisfano questi parametri di ricerca. " +
              "Vi invitiamo a modificare i filtri.");              
           }   
        },          
        error: (errore: any) => {
          this.fEndError = new LogTrace;
          this.fEndError.Level = 'SearchComponent';
          this.fEndError.Message = 'An Error Occurred in SearchByParam';
          this.fEndError.Exception = errore.toString();
          this.logtrace.PostError(this.fEndError);
          console.log(errore);
        }
      })
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.searchParameter = params['param'];
      this.SearchByParam();
    });
  }
  
  GetByParam(parameter: string): Observable<any>{
    return this.http.get(`https://localhost:7228/api/ProductsView/GetByParam/${parameter}`);
  }

}
