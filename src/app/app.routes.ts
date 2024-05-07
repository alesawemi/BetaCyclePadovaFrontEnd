import { Routes } from '@angular/router';

import { HomeComponent } from './core/home/home.component';

import { BikesComponent } from './features/bikes/bikes.component';
import { ComponentsComponent } from './features/components/components.component';
import { AccessoriesComponent } from './features/accessories/accessories.component';
import { ClothingComponent } from './features/clothing/clothing.component';
import { BlogComponent } from './features/blog/blog.component';

import { LoginRegistrationComponent } from './core/login-registration/login-registration.component';
import { LogoutComponent } from './core/logout/logout.component';
import { FooterComponent } from './core/footer/footer.component';

export const routes: Routes = [

    {path: 'home', component: HomeComponent},
    
    {path: 'bikes', component: BikesComponent},
    {path: 'components', component: ComponentsComponent},
    {path: 'accessories', component: AccessoriesComponent},
    {path: 'clothing', component: ClothingComponent},
    {path: 'blog', component: BlogComponent},    
    
    {path: 'login&registration', component: LoginRegistrationComponent},
    {path: 'logout', component: LogoutComponent},

    {path: 'footer', component: FooterComponent},
    { path: '', redirectTo: 'home', pathMatch: 'full' }, //Reindirizza alla pagina home 
];
