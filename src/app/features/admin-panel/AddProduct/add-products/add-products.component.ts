import { Component } from '@angular/core';
import { AddProductService } from '../../../../shared/services/add-product.service';
import { AddProduct } from '../../../../shared/models/product';
import { NgModel } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CategoryNameParent } from '../../../../shared/models/ProductCategory';
import { NgFor, NgIf } from '@angular/common';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-add-products',
  standalone: true,
  imports: [FormsModule,NgFor,NgIf],
  templateUrl: './add-products.component.html',
  styleUrl: './add-products.component.css'
})

export class AddProductsComponent {

  
constructor(private productService: AddProductService){}

newProduct: AddProduct = new AddProduct();


imageUrl: string | ArrayBuffer | null = '';
  // Funzione per rimuovere il valore e mostrare il placeholder

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
        if (typeof this.imageUrl === 'string') {

          this.newProduct.thumbNailPhoto = this.imageUrl.split(',')[1];
          this.newProduct.largeImage = this.imageUrl.split(',')[1];
          (document.getElementById('productImage') as HTMLImageElement).src = this.imageUrl;
        }
      };
      reader.readAsDataURL(file);
    }
  }
  
  addProduct() {
    this.newProduct.SellStartDate = new Date().toISOString();
    this.newProduct.ProductCategoryID=5;
    this.newProduct.productModelId = 25;
    this.productService.PostAdd(this.newProduct).subscribe({
      next: response => {
        console.log(response);
        // Qui puoi gestire la risposta del server
      },
      error: error => {
        console.error(error);
        console.error('Dettagli errori' + error.message);
        console.error('Dettagli errori' + error.models);
        console.error('Dettagli errori' + error.productModel);
        // Qui puoi gestire eventuali errori
      }
    });
  }

  categories: CategoryNameParent[] = [];

  IsOK: boolean = false;
 
}
  

