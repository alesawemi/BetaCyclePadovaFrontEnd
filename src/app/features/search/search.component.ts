import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GeneralView } from '../../shared/models/viewsData';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})

export class SearchComponent {

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  searchParameter: string = '';  

  filteredResult: GeneralView[] = [];

  SearchByParam() {
    this.GetByParam(this.searchParameter)
      .subscribe({
        next: (Data: any) => { 
          if (Data.$values.length>0) { this.filteredResult = Data.$values; } 
          else { 
            alert("Siamo spiacenti, " +
              "al momento non sono presenti prodotti che soddisfano questi parametri di ricerca. " +
              "Vi invitiamo a modificare i filtri.");              
           }   
        },          
        error: (errore: any) => {
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
