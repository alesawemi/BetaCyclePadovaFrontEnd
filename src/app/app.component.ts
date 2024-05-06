import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./core/navbar/navbar.component";
import { HomeComponent } from './core/home/home.component';
import { LoginComponent } from './core/login/login.component';
import { FooterComponent } from './core/footer/footer.component';
import { ProductsComponent } from './features/products/products.component';
import { LogoutComponent } from './core/logout/logout.component';


@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, NavbarComponent,HomeComponent,LoginComponent,FooterComponent,ProductsComponent, LogoutComponent]
})
export class AppComponent {
  title = 'BetaCycle_Padova';
  
}
