import { Component } from '@angular/core';
import { RoleService } from '../../shared/services/role.service';
import { RouterModule } from '@angular/router';
import { AddProduct } from '../../shared/models/product';
import { AddProductService } from '../../shared/services/add-product.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css'
})
export class AdminPanelComponent {

  userRole: string ='';
  constructor(private roleService: RoleService) {}


}
