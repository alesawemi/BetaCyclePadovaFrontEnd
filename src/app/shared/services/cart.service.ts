import { Injectable } from '@angular/core';
import { GeneralView } from '../models/viewsData';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor() { }

  selectedItems: GeneralView[] = [];

  AddToCart(item: GeneralView) {
    this.selectedItems.push(item);
    console.log(this.selectedItems);
  }

}
