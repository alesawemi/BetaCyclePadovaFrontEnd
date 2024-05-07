import { Component } from '@angular/core';
import { Product } from '../../shared/models/productsdata';
import { CommonModule } from '@angular/common';
import { ProductHttpService } from '../../shared/services/productHttp.service';

@Component({
  selector: 'app-bikes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bikes.component.html',
  styleUrl: './bikes.component.css'
})
export class BikesComponent {
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

