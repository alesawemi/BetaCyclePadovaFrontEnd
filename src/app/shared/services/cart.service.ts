import { Injectable } from '@angular/core';
import { GeneralView } from '../models/viewsData';
import { SalesOrderHttp } from './salesOrder.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(salesOrders: SalesOrderHttp) { } //ho creato un service per gestire gli SalesOrders sia gli Headers che i Details.

  selectedItems: GeneralView[] = [];

  AddToCart(item: GeneralView) {
    this.selectedItems.push(item);
    console.log(this.selectedItems);
  }




}
