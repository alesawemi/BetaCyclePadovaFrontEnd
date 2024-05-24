import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { CommonService } from '../../shared/services/common.service';
import { GeneralView } from '../../shared/models/viewsData';
import { Filters } from '../../shared/models/productsFilters';
import { Interval } from '../../shared/models/intervalsData';
import { Properties } from '../../shared/models/productProperties';

@Component({
  selector: 'app-bikes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bikes.component.html',
  styleUrl: './bikes.component.css'
})

export class BikesComponent {

  //change this number to choose how many intervals to show for price and weight
  nPriceIntervals: number = 4; 
  nWeightIntervals: number = 6;

  constructor(private http: CommonService) {}

  allBikes: GeneralView[] = [];
  
  // get full list of Bikes
  //executed on page load (see ngOnInit at the end of this file) and when filters are removed
  GetAllBikes(){

    //to remove all filters and reset all variables used to manage checkboxes
    this.RemoveAllFilters();    
    
    //get all Accessories
    this.http.GetAll(`https://localhost:7228/api/BikesViews`)
    .subscribe({
        next: (Data: any) => { 
          if (Data.$values) { this.allBikes = Data.$values; } 
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
  bikeProperties: Properties = new Properties();

  //price/weight intervals
  
  prices: number[] = [];
  pricesRange: boolean [] = [];
  priceIntervals: string[] = [];

  weights: number[] = [];
  weightsRange: boolean [] = [];
  weightIntervals: string[] = [];

  //executed on page load (see ngOnInit at the end of this file) 
  GetResearchOptions(){
    this.http.GetProperties(`https://localhost:7228/api/BikesViews/GetProductProperties`)
    .subscribe({
        next: (Data: any) => { 
          //available colors and available categories
          this.bikeProperties.availableColors = Data.availableColors.$values;
          this.bikeProperties.availableCategories = Data.availableCategories.$values;
          this.bikeProperties.availableSizes = Data.availableSizes.$values;

          this.bikeProperties.priceMax = Data.priceAndWeight.maxP;
          this.bikeProperties.priceMin = Data.priceAndWeight.minP;

          this.bikeProperties.weightMax = Data.priceAndWeight.maxW;
          this.bikeProperties.weightMin = Data.priceAndWeight.minW;

          //set price range
          this.SetPriceIntervals(
            this.bikeProperties.priceMax, this.bikeProperties.priceMin, this.nPriceIntervals);

          this.SetWeightIntervals(
            this.bikeProperties.weightMax, this.bikeProperties.weightMin, this.nWeightIntervals);

          for (let j=0; j<(this.nPriceIntervals); j++) {
            //string intervals to show and select
            this.priceIntervals[j]=(this.prices[j]).toString();
            this.priceIntervals[j]=this.priceIntervals[j].concat(" - ", (this.prices[j+1]).toString());
            //all checkboxes for price intervals active and not selected
            this.selectedPriceRange[j] = false;

            //this.checkedPrices[j] = false; //you need this when only one interval selection is allowed

          }

          for (let j=0; j<(this.nWeightIntervals); j++) {
            //string intervals to show and select
            this.weightIntervals[j]=((this.weights[j]/1000).toFixed(1)).toString();
            this.weightIntervals[j]=this.weightIntervals[j].concat(" - ", ((this.weights[j+1]/1000).toFixed(1)).toString());
            //all checkboxes for weight intervals active and not selected
            this.selectedWeightRange[j] = false;

            // this.checkedWeights[j] = false; //you need this when only one interval selection is allowed

          }
          
        },
        error: (errore: any) => {
          console.log(errore);
        }
      })    
  }
 


  // ifDescending(event: any) {
  //   if (event.target.checked) {
  //     this.http.GetAll(`https://localhost:7228/api/BikesViews/OrderByPriceDescending`)
  //       .subscribe({
  //         next: (Data: any) => {
  //           if (Data.$values) { this.allBikes = Data.$values; }
  //           else { console.error("Response format is not as expected"); }
  //         },
  //         error: (errore: any) => {
  //           console.log(errore);
  //         }
  //       })
  //   }
  //   else this.GetAllBikes();
  // }

  // ifAscending(event: any){
  //   if (event.target.checked) {
  //     this.http.GetAll(`https://localhost:7228/api/BikesViews/OrderByPriceAscending`)
  //       .subscribe({
  //         next: (Data: any) => {
  //           if (Data.$values) { this.allBikes = Data.$values; }
  //           else { console.error("Response format is not as expected"); }
  //         },
  //         error: (errore: any) => {
  //           console.log(errore);
  //         }
  //       })
  //   }
  //   else this.GetAllBikes();
  // }


  
  // //comment if you allow multiple price selection
  // checkedPrices: boolean[] = [];
  // checkPrice(event: any){        
  //   if (event.target.checked) {
  //     for(let y=0; y<this.priceIntervals.length; y++) {      
  //       if(this.selectedPriceRange[y] == false) { this.checkedPrices[y] = true; }    
  //     }
  //   }    
  //   else {
  //     for(let y=0; y<this.priceIntervals.length; y++) { this.checkedPrices[y] = false; }
  //   }  
  // }

  // //comment if you allow multiple weight selection
  // checkedWeights: boolean[] = [];
  // checkWeight(event: any){        
  //   if (event.target.checked) {
  //     for(let y=0; y<this.weightIntervals.length; y++) {      
  //       if(this.selectedWeightRange[y] == false) { this.checkedWeights[y] = true; }    
  //     }
  //   }    
  //   else {
  //     for(let y=0; y<this.weightIntervals.length; y++) { this.checkedWeights[y] = false; }
  //   }  
  // }


  //to filter the research
  
  selectedColors: { [key: string]: boolean } = {};
  selectedCategories: { [key: string]: boolean } = {};
  selectedSizes: {[key: string]: boolean} = {};
  
  selectedPriceRange: boolean[] = [];
  selectedWeightRange: boolean[] = [];
  
  newInterval: Interval = new Interval;

  priceAscending: boolean = false; 
  priceDescending: boolean = false;

  filtersFromInput: Filters = new Filters();

  GetBikesWithFilters(){

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

    //create string for size selection
    if (Object.keys(this.selectedSizes).length > 0) {
      this.filtersFromInput.size = '';
      for (const s of Object.keys(this.selectedSizes)) {
        if (this.selectedSizes[s]) {
          this.filtersFromInput.size = this.filtersFromInput.size.concat(":" + s)
        } 
      }
    }

    //set min/max price - multiple selection allowed    
    this.filtersFromInput.pIntervals = [];
    for (let z=0; z<this.selectedPriceRange.length; z++) {     
      if (this.selectedPriceRange[z]) { 
        this.newInterval = new Interval;
        this.newInterval.min = this.prices[z];
        this.newInterval.max = this.prices[z+1];
        this.filtersFromInput.pIntervals.push(this.newInterval);
      }
    }  

    //set min/max weight - multiple selection allowed 
    this.filtersFromInput.wIntervals = [];   
    for (let z=0; z<this.selectedWeightRange.length; z++) {     
      if (this.selectedWeightRange[z]) {     
        this.newInterval = new Interval;            
        this.newInterval.min = this.weights[z];
        this.newInterval.max = this.weights[z+1];
        this.filtersFromInput.wIntervals.push(this.newInterval);
      }
    } 
      
    //order by ascending/descending price if corresponding option is selected (checkboxes)
    this.filtersFromInput.ascPrice = this.priceAscending;
    this.filtersFromInput.descPrice = this.priceDescending;

    this.http.GetWithFilters(`https://localhost:7228/api/BikesViews/GetWithFilters`, 
      this.filtersFromInput)
    .subscribe({
        next: (Data: any) => { 
          console.log(Data)
          if (Data.body.$values.length > 0) { 
            this.allBikes = Data.body.$values; 
            // this.RemoveAllFilters();
          } 
          else { 
            alert("Siamo spiacenti, " +
              "al momento non sono presenti prodotti che soddisfano questi parametri di ricerca. " +
              "Vi invitiamo a modificare i filtri.");
            this.GetAllBikes();
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
    
    this.priceAscending = false;
    this.priceDescending = false;

    //reset color options
    for (const col of Object.keys(this.selectedColors)) { this.selectedColors[col] = false; }
    this.selectedColors = {};
    
    //reset category options
    for (const cat of Object.keys(this.selectedCategories)) { this.selectedCategories[cat] = false; }
    this.selectedCategories = {};

    //reset size options
    for (const s of Object.keys(this.selectedSizes)) { this.selectedSizes[s] = false; }
    this.selectedSizes = {};

    //reset price options
    for (let j=0; j<(this.nPriceIntervals); j++) {
      this.selectedPriceRange[j] = false;
      // this.checkedPrices[j] = false; //you need this when only one interval selection is allowed
    }

    //reset weights options
    for (let j=0; j<(this.nWeightIntervals); j++) {
      this.selectedWeightRange[j] = false;
      // this.checkedWeights[j] = false; //you need this when only one interval selection is allowed
    }
  }



  // create price/weight intervals according to min, max and desired number of intervals 
  // (tune this value at the beginning of this file)
  maxIndex: number = 0;
  step: number = 0;

  SetPriceIntervals(pMax: number, pMin: number, nWindows: number){
   
    this.step = Math.floor((pMax - pMin)/nWindows);

    this.prices[0] = pMin;
    
    for (let i =1; i<nWindows; i++) {
      this.prices[i] = Math.floor(pMin + (i*this.step));
      this.maxIndex = i;
    }
    
    this.prices[this.maxIndex+1] = pMax; 
  }

  SetWeightIntervals(wMax: number, wMin: number, nWindows: number){
   
    this.step = Math.floor((wMax - wMin)/nWindows);

    this.weights[0] = wMin;
    
    for (let i =1; i<nWindows; i++) {
      this.weights[i] = Math.floor(wMin + (i*this.step));
      this.maxIndex = i;
    }
    
    this.weights[this.maxIndex+1] = wMax; 
  }


  //methods to be executed when page loads : full list of Accessories and search options
  ngOnInit() {
    this.GetAllBikes();
    this.GetResearchOptions();
  }

}
 



