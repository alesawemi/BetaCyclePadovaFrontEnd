import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { GenericViewService } from '../../shared/services/genericview.service';
import { HttpParams } from '@angular/common/http';
import { Filters } from '../../shared/models/productsFilters';
import { Interval } from '../../shared/models/intervalsData';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CartService } from '../../shared/services/cart.service';

@Component({
  selector: 'app-accessories',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSlideToggleModule],
  templateUrl: './accessories.component.html',
  styleUrls: ['../../features/Stili/shared.css', './accessories.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})

export class AccessoriesComponent {

  constructor(public view: GenericViewService, public cart: CartService) {}


  ngOnInit() {
    this.view.allItems = []; //clear this variable to avoid lany leaking from previous views
    this.GetAll();
    this.GetOptions();
  }


  whichView: HttpParams = new HttpParams().set('view', 'accessories'); 


  //change this number to choose how many intervals to show for price and weight
  nPriceIntervals: number = 4; 
  nWeightIntervals: number = 6;



  //#region Get All
  GetAll(){ //clear all filters and get all products in the view
    this.RemoveAllFilters();
    this.view.GetAllItems(this.whichView);
  }
  //#endregion
  
  
  //#region Load Options
  GetOptions() {
    this.view.GetResearchOptions(this.whichView, this.nPriceIntervals, this.nWeightIntervals);

    //all checkboxes for price intervals active and not selected
    for (let j=0; j<(this.nPriceIntervals); j++) { this.selectedPriceRange[j] = false; }
    //all checkboxes for weight intervals active and not selected
    for (let j=0; j<(this.nWeightIntervals); j++) { this.selectedWeightRange[j] = false;}
    
  }
  //#endregion



  //#region Filters

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

  GetFiltered() {
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
        this.newInterval.min = this.view.prices[z];
        this.newInterval.max = this.view.prices[z+1];
        this.filtersFromInput.pIntervals.push(this.newInterval);
      }
    }  

    //set min/max weight - multiple selection allowed    
    this.filtersFromInput.wIntervals = [];  
    for (let z=0; z<this.selectedWeightRange.length; z++) {
      if (this.selectedWeightRange[z]) {                 
        this.newInterval = new Interval;   
        this.newInterval.min = this.view.weights[z];
        this.newInterval.max = this.view.weights[z+1];
        this.filtersFromInput.wIntervals.push(this.newInterval);
      }
    } 
      
    //order by ascending/descending price if corresponding option is selected (checkboxes)
    this.filtersFromInput.ascPrice = this.priceAscending;
    this.filtersFromInput.descPrice = this.priceDescending;

    this.view.GetWithFilters(this.whichView, this.filtersFromInput); 

  }
  //#endregion



  //#region Clear Filters
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
    this.selectedCategories= {};

    //reset size options
    for (const s of Object.keys(this.selectedSizes)) { this.selectedSizes[s] = false; }
    this.selectedSizes= {};

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
  //#endregion


}
