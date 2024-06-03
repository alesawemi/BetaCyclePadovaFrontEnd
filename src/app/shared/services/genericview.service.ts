import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { GeneralView } from '../../shared/models/viewsData';
import { Properties } from '../../shared/models/productProperties';
import { Filters } from '../../shared/models/productsFilters';
import { LogtraceService } from './logtrace.service';
import { LogTrace } from '../models/LogTraceData';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})

export class GenericViewService {

  constructor(private http: HttpClient, private logtrace: LogtraceService, private Authentication: AuthenticationService) { }



  //fEnd LogTrace
  fEndError: LogTrace = new LogTrace;

  //get all items in the view
  allItems: GeneralView[] = [];
  
  GetAllItems(whichView: HttpParams){

    this.GetAllFromView(whichView)
    .subscribe({
        next: (Data: any) => { 
          if (Data.$values) { 
            this.allItems = Data.$values;   
            this.allItems.forEach(element => {
              element.largeImage = `data:image/png;base64, ${element.largeImage}`
            })
          }
          else { 
            console.error("Response format is not as expected"); 
            alert("Siamo spiacenti, Errore Inaspettato. Si prega di riprovare più tardi.");
          }         
        },
        error: (errore: any) => {
          this.fEndError = new LogTrace;
          this.fEndError.Level = 'error';
          this.fEndError.Message = `An Error Occurred in GetAllItems for ${whichView}`;
          this.fEndError.Logger = 'GeneralViewService';
          this.fEndError.Exception = errore.toString();
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



  //available options to filter the research
  viewProperties: Properties = new Properties();

  //price intervals  
  prices: number[] = [];
  pricesRange: boolean [] = [];
  priceIntervals: string[] = [];

  //weight intervals 
  weights: number[] = [];
  weightsRange: boolean [] = [];
  weightIntervals: string[] = [];

  GetResearchOptions(whichView: HttpParams, nPriceIntervals: number, nWeightIntervals: number){
    this.GetPropertiesFromView(whichView)
      .subscribe({
        next: (Data: any) => { 
          //available colors and available categories
          this.viewProperties.availableColors = Data.availableColors.$values;
          this.viewProperties.availableCategories = Data.availableCategories.$values;
          this.viewProperties.availableSizes = Data.availableSizes.$values;

          this.viewProperties.priceMax = Data.priceAndWeight.maxP;
          this.viewProperties.priceMin = Data.priceAndWeight.minP;

          this.viewProperties.weightMax = Data.priceAndWeight.maxW;
          this.viewProperties.weightMin = Data.priceAndWeight.minW;    

          //set price range - price never NULL
          this.SetPriceIntervals(
            this.viewProperties.priceMax, this.viewProperties.priceMin, nPriceIntervals);

          for (let j=0; j<(nPriceIntervals); j++) {
            //string intervals to show and select
            this.priceIntervals[j]=(this.prices[j]).toString();
            this.priceIntervals[j]=this.priceIntervals[j].concat(" - ", (this.prices[j+1]).toString())
          }

          //set weight range - check to make sure weight is not NULL
          if (this.viewProperties.weightMax != 0 && this.viewProperties.weightMin != 0) {

            this.SetWeightIntervals(
              this.viewProperties.weightMax, this.viewProperties.weightMin, nWeightIntervals);

            for (let j=0; j<(nWeightIntervals); j++) {
              //string intervals to show and select
              this.weightIntervals[j]=((this.weights[j]/1000).toFixed(1)).toString();
              this.weightIntervals[j]=this.weightIntervals[j].concat(" - ", ((this.weights[j+1]/1000).toFixed(1)).toString());
            }
          }

          else { this.weightIntervals = []; }

        },
        error: (errore: any) => {
          this.fEndError = new LogTrace;
          this.fEndError.Level = 'error';
          this.fEndError.Message = `An Error Occurred in GetResearchOptions for ${whichView}`;
          this.fEndError.Logger = 'GeneralViewService';
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



  GetWithFilters(whichView: HttpParams, filtersFromInput: Filters){
    this.GetWithFiltersFromView(whichView, filtersFromInput)
    .subscribe({
        next: (Data: any) => { 
          if (Data.body.$values.length > 0) { 
            this.allItems = Data.body.$values;
            this.allItems.forEach(element => {
              element.largeImage = `data:image/png;base64, ${element.largeImage}`
            }) 
          } 
          else { 
            alert("Siamo spiacenti, " +
              "al momento non sono presenti prodotti che soddisfano questi parametri di ricerca. " +
              "Vi invitiamo a modificare i filtri.");              
           }         
        },
        error: (errore: any) => {
          this.fEndError = new LogTrace;
          this.fEndError.Logger = 'error';
          this.fEndError.Message = `An Error Occurred in GetWithFilters for ${whichView}`;
          this.fEndError.Logger = 'GeneralViewService';
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



  GetAllFromView(whichView: HttpParams): Observable<any>{
    return this.http.get(`https://localhost:7228/api/GenericViews`, {params: whichView});
  }

  GetPropertiesFromView(whichView: HttpParams): Observable<any>{
    return this.http.get(`https://localhost:7228/api/GenericViews/GetProperties`, {params: whichView});
  }

  GetWithFiltersFromView(whichview: HttpParams, filters: Filters): Observable<any>{
    return this.http.post(`https://localhost:7228/api/GenericViews/GetWithFilters`, filters, 
    { headers: this.Authentication.authHeader,
      params: whichview, observe: 'response' });
  }
  
  
}
