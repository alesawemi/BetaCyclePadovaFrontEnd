import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccessoriesService } from '../../shared/services/accessories.service';
import { Accessory } from '../../shared/models/accessoriesData';

@Component({
  selector: 'app-accessories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accessories.component.html',
  styleUrl: './accessories.component.css'
})
export class AccessoriesComponent {

  constructor(private http: AccessoriesService) {}

  allAccessories: Accessory[] = [];

  GetAllAccessories(){
    this.http.GetAccessories()
    .subscribe({
        next: (Data: any) => { 
          if (Data.$values) { this.allAccessories = Data.$values; } 
          else { console.error("Response format is not as expected"); }         
        },
        error: (errore: any) => {
          console.log(errore);
        }
      })
  }

}
