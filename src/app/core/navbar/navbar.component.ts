import { Component } from "@angular/core";
import { RouterModule } from '@angular/router';
import { Router } from "@angular/router";
import { HomeComponent } from "../home/home.component";
import { CommonModule } from "@angular/common";
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { AuthenticationService } from "../../shared/services/authentication.service";
import { ReactiveFormsModule } from '@angular/forms';
import { RoleService } from "../../shared/services/role.service";
import { OnInit } from "@angular/core";
import { CartService } from "../../shared/services/cart.service";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, HomeComponent, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  showDropdown = false;
  userRole: boolean =false;
  constructor(public auth: AuthenticationService, private router: Router, public roleService: RoleService, 
    public cart: CartService) {    }

  searchParameter: string = '';

  Search(parameter: string): void {
    if (parameter) {
      this.router.navigate(['/search'], { queryParams: { param: parameter } });
    }
  }

  ngOnInit() {
    this.cart.cartName = `cart_${this.cart.email}`; //?
    this.cart.Count();
  }

}