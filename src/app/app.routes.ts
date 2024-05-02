import { Routes } from '@angular/router';
// import { OldCustomersComponent } from './features/old-customers/old-customers.component';
import { LoginComponent } from './core/login/login.component';
// import { ProductsComponent } from './features/products/products.component';
import { HomeComponent } from './core/home/home.component';
import { FooterComponent } from './core/footer/footer.component';

export const routes: Routes = [

    {path: 'login', component: LoginComponent},
    // {path: 'oldCustomers', component: OldCustomersComponent},
    // {path: 'products', component: ProductsComponent},
    {path: 'home', component: HomeComponent},
    {path: 'footer', component: FooterComponent}

    

];
