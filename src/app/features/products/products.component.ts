import { Component } from '@angular/core';
import { Product } from '../../shared/models/productsdata';
import { CommonModule } from '@angular/common';
import { ProductHttpService } from '../../shared/services/productHttp.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
  constructor(private mainHttp: ProductHttpService) {}

  allProductsList: Product[] = [];

  GetAllProducts(){
    this.mainHttp.httpGetProducts()
    .subscribe({
        next: (Data: any) => { 
          this.allProductsList = Data;
        },
        error: (errore: any) => {
          console.log(errore);
        }
      })
  }

}
