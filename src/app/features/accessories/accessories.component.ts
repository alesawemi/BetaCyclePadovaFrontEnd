import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, NgModel } from '@angular/forms';
import { CommonService } from '../../shared/services/common.service';
import { Accessory } from '../../shared/models/accessoriesData';
import { Filters } from '../../shared/models/productsFilters';
import { Properties } from '../../shared/models/productProperties';

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

    for (const col of Object.keys(this.selectedColors)) { this.selectedColors[col] = false; }
    this.selectedColors = {};
    this.filtersFromInput.color = 'color';
    
    for (const cat of Object.keys(this.selectedCategories)) { this.selectedCategories[cat] = false; }
    this.selectedCategories= {};
    this.filtersFromInput.productCategory = 'category';

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

  accessoryProperties: Properties = new Properties();

  GetResearchOptions(){
    this.http.GetProperties(`https://localhost:7228/api/AccessoriesViews/GetProductProperties`)
    .subscribe({
        next: (Data: any) => { 
          this.accessoryProperties.availableColors = Data.availableColors.$values;
          this.accessoryProperties.availableCategories = Data.availableCategories.$values;
          this.accessoryProperties.priceMax = Data.priceMax;
          this.accessoryProperties.priceMin = Data.priceMin;
        },
        error: (errore: any) => {
          console.log(errore);
        }
      })
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
  
  selectedColors: { [key: string]: boolean } = {};
  selectedCategories: { [key: string]: boolean } = {};

  GetAccessoriesWithFilters(){

    if (Object.keys(this.selectedColors).length > 0) {
      this.filtersFromInput.color = '';
      for (const color of Object.keys(this.selectedColors)) {
        if (this.selectedColors[color]) {
          this.filtersFromInput.color = this.filtersFromInput.color.concat(":" + color)
        }
      }
    }    

    if (Object.keys(this.selectedCategories).length > 0) {
      this.filtersFromInput.productCategory = '';
      for (const cat of Object.keys(this.selectedCategories)) {
        if (this.selectedCategories[cat]) {
          this.filtersFromInput.productCategory = this.filtersFromInput.productCategory.concat(":" + cat)
        }
      }
    }
    

    this.filtersFromInput.productName = 'allProducts';    
    //this.filtersFromInput.color = 'red'; 
    this.filtersFromInput.size = 'size';  
    //this.filtersFromInput.productCategory = 'category';
    this.filtersFromInput.maxPrice = 0.;
    this.filtersFromInput.minPrice = 0.;
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
    this.GetAllAccessories();
    this.GetResearchOptions();
  }

}
