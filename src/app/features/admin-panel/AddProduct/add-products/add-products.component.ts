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
 
  productCategories = [
    { id: 1, parentID: 1, name: 'Mountain Bikes' },
    { id: 2, parentID: 1, name: 'Road Bikes' },
    { id: 3, parentID: 1, name: 'Touring Bikes' },
    { id: 4, parentID: 2, name: 'Handlebars' },
    { id: 5, parentID: 2, name: 'Bottom Brackets' },
    { id: 6, parentID: 2, name: 'Brakes' },
    { id: 7, parentID: 2, name: 'Chains' },
    { id: 8, parentID: 2, name: 'Cranksets' },
    { id: 9, parentID: 2, name: 'Derailleurs' },
    { id: 10, parentID: 2, name: 'Forks' },
    { id: 11, parentID: 2, name: 'Headsets' },
    { id: 12, parentID: 2, name: 'Mountain Frames' },
    { id: 13, parentID: 2, name: 'Pedals' },
    { id: 14, parentID: 2, name: 'Road Frames' },
    { id: 15, parentID: 2, name: 'Saddles' },
    { id: 16, parentID: 2, name: 'Touring Frames' },
    { id: 17, parentID: 2, name: 'Wheels' },
    { id: 18, parentID: 3, name: 'Bib-Shorts' },
    { id: 19, parentID: 3, name: 'Caps' },
    { id: 20, parentID: 3, name: 'Gloves' },
    { id: 21, parentID: 3, name: 'Jerseys' },
    { id: 22, parentID: 3, name: 'Shorts' },
    { id: 23, parentID: 3, name: 'Socks' },
    { id: 24, parentID: 3, name: 'Tights' },
    { id: 25, parentID: 3, name: 'Vests' },
    { id: 26, parentID: 4, name: 'Bike Racks' },
    { id: 27, parentID: 4, name: 'Bike Stands' },
    { id: 28, parentID: 4, name: 'Bottles and Cages' },
    { id: 29, parentID: 4, name: 'Cleaners' },
    { id: 30, parentID: 4, name: 'Fenders' },
    { id: 31, parentID: 4, name: 'Helmets' },
    { id: 32, parentID: 4, name: 'Hydration Packs' },
    { id: 33, parentID: 4, name: 'Lights' },
    { id: 34, parentID: 4, name: 'Locks' },
    { id: 35, parentID: 4, name: 'Panniers' },
    { id: 36, parentID: 4, name: 'Pumps' },
    { id: 37, parentID: 4, name: 'Tires and Tubes' }
  ];
}
  

