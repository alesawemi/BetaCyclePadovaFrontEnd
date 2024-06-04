import { Component } from '@angular/core';
import { AddProductService } from '../../../../shared/services/add-product.service';
import { AddProduct } from '../../../../shared/models/product';
import { NgModel } from '@angular/forms';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-add-products',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-products.component.html',
  styleUrl: './add-products.component.css'
})

export class AddProductsComponent {

  
constructor(private productService: AddProductService){}
newProduct: AddProduct = new AddProduct();


  addProduct() {
    this.newProduct.SellStartDate = new Date().toISOString();
    this.newProduct.ProductCategoryID=1;
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
}
  

