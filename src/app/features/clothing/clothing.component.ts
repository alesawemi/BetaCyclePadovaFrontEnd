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
  selector: 'app-clothing',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSlideToggleModule],
  templateUrl: './clothing.component.html',
  styleUrls: ['../../features/Stili/shared.css', './clothing.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ClothingComponent {

  constructor(public view: GenericViewService, public cart: CartService) {}

  //#region Init
  ngOnInit() {
    this.view.allItems = []; // Clear this variable to avoid any leaking from previous views
    this.GetAll();
    this.GetOptions();
  }
  //#endregion

  whichView: HttpParams = new HttpParams().set('view', 'clothing');

  // Change this number to choose how many intervals to show for price and weight
  nPriceIntervals: number = 4; 
  nWeightIntervals: number = 6;

  //#region Get All
  GetAll() { // Clear all filters and get all products in the view
    this.RemoveAllFilters();
    this.view.GetAllItems(this.whichView);
  }
  //#endregion

  //#region Load Options
  GetOptions() {
    this.view.GetResearchOptions(this.whichView, this.nPriceIntervals, this.nWeightIntervals);

    // All checkboxes for price intervals active and not selected
    for (let j = 0; j < (this.nPriceIntervals); j++) { 
      this.selectedPriceRange[j] = false; 
    }
    // All checkboxes for weight intervals active and not selected
    for (let j = 0; j < (this.nWeightIntervals); j++) { 
      this.selectedWeightRange[j] = false;
    }
  }
  //#endregion

  //#region Filters
  // To filter the research

  selectedColors: { [key: string]: boolean } = {};
  selectedCategories: { [key: string]: boolean } = {};
  selectedSizes: { [key: string]: boolean } = {};
  
  selectedPriceRange: boolean[] = [];
  selectedWeightRange: boolean[] = [];

  newInterval: Interval = new Interval;

  priceAscending: boolean = false; 
  priceDescending: boolean = false;

  filtersFromInput: Filters = new Filters();

  GetFiltered() {
    // Create string for color selection
    if (Object.keys(this.selectedColors).length > 0) {
      this.filtersFromInput.color = '';
      for (const color of Object.keys(this.selectedColors)) {
        if (this.selectedColors[color]) {
          this.filtersFromInput.color = this.filtersFromInput.color.concat(":" + color)
        }
      }
    }    

    // Create string for category selection
    if (Object.keys(this.selectedCategories).length > 0) {
      this.filtersFromInput.productCategory = '';
      for (const cat of Object.keys(this.selectedCategories)) {
        if (this.selectedCategories[cat]) {
          this.filtersFromInput.productCategory = this.filtersFromInput.productCategory.concat(":" + cat)
        }
      }
    }

    // Create string for size selection
    if (Object.keys(this.selectedSizes).length > 0) {
      this.filtersFromInput.size = '';
      for (const s of Object.keys(this.selectedSizes)) {
        if (this.selectedSizes[s]) {
          this.filtersFromInput.size = this.filtersFromInput.size.concat(":" + s)
        }
      }
    }

    // Set min/max price - multiple selection allowed   
    this.filtersFromInput.pIntervals = []; 
    for (let z = 0; z < this.selectedPriceRange.length; z++) {
      if (this.selectedPriceRange[z]) {    
        this.newInterval = new Interval;     
        this.newInterval.min = this.view.prices[z];
        this.newInterval.max = this.view.prices[z + 1];
        this.filtersFromInput.pIntervals.push(this.newInterval);
      }
    }  

    // Set min/max weight - multiple selection allowed    
    this.filtersFromInput.wIntervals = [];  
    for (let z = 0; z < this.selectedWeightRange.length; z++) {
      if (this.selectedWeightRange[z]) {                 
        this.newInterval = new Interval;   
        this.newInterval.min = this.view.weights[z];
        this.newInterval.max = this.view.weights[z + 1];
        this.filtersFromInput.wIntervals.push(this.newInterval);
      }
    } 
      
    // Order by ascending/descending price if corresponding option is selected (checkboxes)
    this.filtersFromInput.ascPrice = this.priceAscending;
    this.filtersFromInput.descPrice = this.priceDescending;

    this.view.GetWithFilters(this.whichView, this.filtersFromInput); 
  }
  //#endregion

  //#region Clear Filters
  // To remove all filters and reset all the variables used to manage the checkboxes
  RemoveAllFilters() {
    
    this.filtersFromInput = new Filters;
    
    this.priceAscending = false;
    this.priceDescending = false;

    // Reset color options
    for (const col of Object.keys(this.selectedColors)) { 
      this.selectedColors[col] = false; 
    }
    this.selectedColors = {};
    
    // Reset category options
    for (const cat of Object.keys(this.selectedCategories)) { 
      this.selectedCategories[cat] = false; 
    }
    this.selectedCategories = {};

    // Reset size options
    for (const s of Object.keys(this.selectedSizes)) { 
      this.selectedSizes[s] = false; 
    }
    this.selectedSizes = {};

    // Reset price options
    for (let j = 0; j < (this.nPriceIntervals); j++) {
      this.selectedPriceRange[j] = false;
      // this.checkedPrices[j] = false; // You need this when only one interval selection is allowed
    }

    // Reset weights options
    for (let j = 0; j < (this.nWeightIntervals); j++) {
      this.selectedWeightRange[j] = false;
      // this.checkedWeights[j] = false; // You need this when only one interval selection is allowed
    }
  }
  //#endregion

  
}
