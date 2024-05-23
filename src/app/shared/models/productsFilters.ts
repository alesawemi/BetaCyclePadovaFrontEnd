import { Interval } from "./intervalsData";

export class Filters {
    productName: string = '';    
    color: string = '';   
    size: string = '';  
    productCategory: string = '';
    pIntervals: Interval[] = [];
    wIntervals: Interval[] = [];
    descPrice: boolean = false;
    ascPrice: boolean = false;
}