import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { CartService } from '../../shared/services/cart.service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {

  constructor(public cart: CartService, private router: Router) {}

  ngOnInit(){
    this.cart.syncCart();
  }

  RedirectToCheckout(){
    this.router.navigate(['checkout']);
  }
}
