import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./core/navbar/navbar.component";
import { HomeComponent } from './core/home/home.component';

import { BikesComponent } from './features/bikes/bikes.component';
import { ComponentsComponent } from './features/components/components.component';
import { AccessoriesComponent } from './features/accessories/accessories.component';
import { ClothingComponent } from './features/clothing/clothing.component';
import { SearchComponent } from './features/search/search.component';
import { BlogComponent } from './features/blog/blog.component';

import { CartComponent } from './features/cart/cart.component';

import { LoginRegistrationComponent } from './core/login-registration/login-registration.component';
import { LogoutComponent } from './core/logout/logout.component';
import { FooterComponent } from './core/footer/footer.component';

import { ReactiveFormsModule } from '@angular/forms';

import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, NavbarComponent,
      HomeComponent, 
      BikesComponent,  AccessoriesComponent, ClothingComponent, ComponentsComponent, SearchComponent, 
      BlogComponent, CartComponent,
      LoginRegistrationComponent, LogoutComponent, FooterComponent,
      FormsModule, CommonModule, ReactiveFormsModule]
})
export class AppComponent {
  title = 'BetaCycle_Padova';
  
}
