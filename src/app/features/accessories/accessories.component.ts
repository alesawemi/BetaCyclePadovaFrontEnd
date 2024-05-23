import { Component, NgProbeToken } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { FormsModule, ReactiveFormsModule, NgModel } from '@angular/forms';
import { FormsModule, NgModel } from '@angular/forms';
import { CommonService } from '../../shared/services/common.service';
import { Accessory } from '../../shared/models/accessoriesData';
import { Filters } from '../../shared/models/productsFilters';
import { Properties } from '../../shared/models/productProperties';
import { concat } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-accessories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './accessories.component.html',
  styleUrl: './accessories.component.css'
})

export class AccessoriesComponent {

  //change this number to choose how many price intervals to show
  nPriceIntervals: number = 4; 

  constructor(private http: CommonService) {}

  allAccessories: Accessory[] = [];
  
  // get full list of Accessories
  //executed on page load (see ngOnInit at the end of this file) and when filters are removed
  GetAllAccessories(){

    //to remove all filters and reset all variables used to manage checkboxes
    this.RemoveAllFilters();    
    
    //get all Accessories
    this.http.GetAll(`https://localhost:7228/api/AccessoriesViews`)
    .subscribe({
        next: (Data: any) => { 
          if (Data.$values) { this.allAccessories = Data.$values; } 
          else { 
            console.error("Response format is not as expected"); 
            alert("Siamo spiacenti, Errore Inaspettato. Si prega di riprovare più tardi.");
          }         
        },
        error: (errore: any) => {
          console.log(errore);
        }
      })
  }



  //available options to filter the research
  accessoryProperties: Properties = new Properties();

  //price intervals
  step: number = 0;
  prices: number[] = [];
  pricesRange: boolean [] = [];
  priceIntervals: string[] = [];

  //executed on page load (see ngOnInit at the end of this file) 
  GetResearchOptions(){
    this.http.GetProperties(`https://localhost:7228/api/AccessoriesViews/GetProductProperties`)
    .subscribe({
        next: (Data: any) => { 
          //available colors and available categories
          this.accessoryProperties.availableColors = Data.availableColors.$values;
          this.accessoryProperties.availableCategories = Data.availableCategories.$values;

          this.accessoryProperties.priceMax = Data.priceMax;
          this.accessoryProperties.priceMin = Data.priceMin;

          //set price range
          this.SetPriceIntervals(
            this.accessoryProperties.priceMax, this.accessoryProperties.priceMin, this.nPriceIntervals);

          for (let j=0; j<(this.nPriceIntervals); j++) {
            this.priceIntervals[j]=(this.prices[j]).toString();
            this.priceIntervals[j]=this.priceIntervals[j].concat(" - ", (this.prices[j+1]).toString());
            //all checkboxes for price intervals active and not selected
            this.selectedPriceRange[j] = false;
            this.checkedPrices[j] = false;
          }
          
        },
        error: (errore: any) => {
          console.log(errore);
        }
      })    
  }
   


  //used to order by price the filtered list - bound to "<button> Filtra"
  priceAscending: boolean = false; 
  priceDescending: boolean = false;
  
  //ifDescending selected then automatically applied to list of all products
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

  //ifDescending selected then automatically applied to list of all products
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



  //to allow only one price selection at a time
  checkedPrices: boolean[] = [];
  
  checkPrice(event: any){
    
    //comment if you allow multiple price selection
    if (event.target.checked) {
      for(let y=0; y<this.priceIntervals.length; y++) {      
        if(this.selectedPriceRange[y] == false) { this.checkedPrices[y] = true; }    
      }
    }    
    else {
      for(let y=0; y<this.priceIntervals.length; y++) { this.checkedPrices[y] = false; }
    }  

  }



  //to filter the research
  
  selectedColors: { [key: string]: boolean } = {};
  selectedCategories: { [key: string]: boolean } = {};
  selectedPriceRange: boolean[] = [];
  
  // to use when  multiple price intervals are selected
  indexPrice: number[] = [];
  indexIndex: number = 0;

  filtersFromInput: Filters = new Filters();

  GetAccessoriesWithFilters(){

    //create string for color selection
    if (Object.keys(this.selectedColors).length > 0) {
      this.filtersFromInput.color = '';
      for (const color of Object.keys(this.selectedColors)) {
        if (this.selectedColors[color]) {
          this.filtersFromInput.color = this.filtersFromInput.color.concat(":" + color)
        }
      }
    }    

    //create string for category selection
    if (Object.keys(this.selectedCategories).length > 0) {
      this.filtersFromInput.productCategory = '';
      for (const cat of Object.keys(this.selectedCategories)) {
        if (this.selectedCategories[cat]) {
          this.filtersFromInput.productCategory = this.filtersFromInput.productCategory.concat(":" + cat)
        }
      }
    }


    ////set min/max price - multiple selection allowed
    
    // for (let z=0; z<this.selectedPriceRange.length; z++) {
    //   if (this.selectedPriceRange[z]) {         
    //     this.indexPrice[this.indexIndex] = z;
    //     this.indexIndex++;
    //   }
    // }    

    // if (this.indexIndex > 0) {
    //   this.filtersFromInput.minPrice = this.prices[this.indexPrice[0]];
    //   let last = this.indexPrice.length; 
    //   last = this.indexPrice[last-1];
    //   this.filtersFromInput.maxPrice = this.prices[last+1];
    // }  
    // else {
    //   for(let k=0; k<this.selectedPriceRange.length; k++){
    //       if(this.selectedPriceRange[k]) {
    //         this.filtersFromInput.minPrice = this.prices[k];
    //         this.filtersFromInput.maxPrice = this.prices[k+1];
    //       } 
    //     } 
    // }

    ///set min/max price - multiple selection NOT allowed

    for(let k=0; k<this.selectedPriceRange.length; k++){
      if(this.selectedPriceRange[k]) {
        // this.filtersFromInput.minPrice = this.prices[k];
        // this.filtersFromInput.maxPrice = this.prices[k+1];
      } 
    } 

    
    //order by ascending/descending price if corresponding option is selected (checkboxes)
    this.filtersFromInput.ascPrice = this.priceAscending;
    this.filtersFromInput.descPrice = this.priceDescending;

    this.http.GetWithFilters(`https://localhost:7228/api/AccessoriesViews/GetWithFilters`, 
      this.filtersFromInput)
    .subscribe({
        next: (Data: any) => { 
          console.log(Data)
          if (Data.body.$values.length > 0) { this.allAccessories = Data.body.$values; } 
          else { 
            alert("Siamo spiacenti, " +
              "al momento non sono presenti prodotti che soddisfano questi parametri di ricerca. " +
              "Vi invitiamo a modificare i filtri.");
            this.RemoveAllFilters();
           }         
        },
        error: (errore: any) => {
          console.log(errore);
        }
      })
  }



  //to remove all filters and reset all the variables used to manage the checkboxes
  RemoveAllFilters(){
    this.filtersFromInput = new Filters;

    //accessories randomly sorted (??)
    this.priceAscending = false;
    this.priceDescending = false;

    //reset color options
    for (const col of Object.keys(this.selectedColors)) { this.selectedColors[col] = false; }
    this.selectedColors = {};
    
    //reset category options
    for (const cat of Object.keys(this.selectedCategories)) { this.selectedCategories[cat] = false; }
    this.selectedCategories= {};

    //reset price options
    for (let j=0; j<(this.nPriceIntervals); j++) {
      this.selectedPriceRange[j] = false;
      this.checkedPrices[j] = false;
    }
  }



  // create price intervals according to minPrice, maxPrice and desired number of intervals 
  // (tune this value at the beginning of this file)
  maxIndex: number = 0;

  SetPriceIntervals(pMax: number, pMin: number, nWindows: number){
   
    this.step = Math.floor((pMax - pMin)/nWindows);

    this.prices[0] = pMin;
    
    for (let i =1; i<nWindows; i++) {
      this.prices[i] = Math.floor(pMin + (i*this.step));
      this.maxIndex = i;
    }
    
    this.prices[this.maxIndex+1] = pMax; 
  }



  //methods to be executed when page loads : full list of Accessories and search options
  ngOnInit() {
    this.GetAllAccessories();
    this.GetResearchOptions();
  }

}
