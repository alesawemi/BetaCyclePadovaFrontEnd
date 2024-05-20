import { Interval } from "./intervalsData";

export class Filters {
    productName: string = 'allProducts';    
    color: string = 'color';   
    size: string = 'size';  
    productCategory: string = 'category';
    pIntervals: Interval[] = [];
    wIntervals: Interval[] = [];
    descPrice: boolean = false;
    ascPrice: boolean = false;
}