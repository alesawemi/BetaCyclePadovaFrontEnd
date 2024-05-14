import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, NgModel } from '@angular/forms';
import { CommonService } from '../../shared/services/common.service';
import { Accessory } from '../../shared/models/accessoriesData';
import { Filters } from '../../shared/models/productsFilters';

@Component({
  selector: 'app-accessories',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './accessories.component.html',
  styleUrl: './accessories.component.css'
})

export class AccessoriesComponent {

  constructor(private http: CommonService) {}

  allAccessories: Accessory[] = [];

  GetAllAccessories(){
    this.priceAscending = false;
    this.priceDescending = false;
    this.http.GetAll(`https://localhost:7228/api/AccessoriesViews`)
    .subscribe({
        next: (Data: any) => { 
          if (Data.$values) { this.allAccessories = Data.$values; } 
          else { console.error("Response format is not as expected"); }         
        },
        error: (errore: any) => {
          console.log(errore);
        }
      })
  }

  filtersOn: boolean = false;

  openFilters() {
    this.filtersOn = !this.filtersOn;
  }
  
  priceAscending: boolean = false;
  priceDescending: boolean = false;
  
  ifDescending(event: any) {
    if (event.target.checked) {
      this.http.GetAll(`https://localhost:7228/api/AccessoriesViews/OrderByPriceDescending`)
        .subscribe({
          next: (Data: any) => {
            if (Data.$values) { this.allAccessories = Data.$values; }
            else { console.error("Response format is not as expected"); }
          },
          error: (errore: any) => {
            console.log(errore);
          }
        })
    }
    else this.GetAllAccessories();
  }


  ifAscending(event: any){
    if (event.target.checked) {
      this.http.GetAll(`https://localhost:7228/api/AccessoriesViews/OrderByPriceAscending`)
        .subscribe({
          next: (Data: any) => {
            if (Data.$values) { this.allAccessories = Data.$values; }
            else { console.error("Response format is not as expected"); }
          },
          error: (errore: any) => {
            console.log(errore);
          }
        })
    }
    else this.GetAllAccessories();
  }

  filtersFromInput: Filters = new Filters();

  GetAccessoriesWithFilters(){

    this.filtersFromInput.productName = 'lights';    
    this.filtersFromInput.color = 'color'; 
    this.filtersFromInput.size = 'size';  
    this.filtersFromInput.productCategory = 'category';
    this.filtersFromInput.maxPrice = 0.;
    this.filtersFromInput.minPrice = 5.;
    this.filtersFromInput.maxWeight = 0;
    this.filtersFromInput.minWeight = 0.;
    this.filtersFromInput.ascPrice = this.priceAscending;
    this.filtersFromInput.descPrice = this.priceDescending;

    this.http.GetWithFilters(`https://localhost:7228/api/AccessoriesViews/GetWithFilters`, this.filtersFromInput)
    .subscribe({
        next: (Data: any) => { 
          console.log(Data)
          if (Data.body.$values) { this.allAccessories = Data.body.$values; } 
          else { console.error("Response format is not as expected"); }         
        },
        error: (errore: any) => {
          console.log(errore);
        }
      })
  }


  ngOnInit() {
    this.GetAllAccessories()
  }

}
