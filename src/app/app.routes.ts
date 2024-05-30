import { Routes } from '@angular/router';

import { HomeComponent } from './core/home/home.component';

import { BikesComponent } from './features/bikes/bikes.component';
import { ComponentsComponent } from './features/components/components.component';
import { AccessoriesComponent } from './features/accessories/accessories.component';
import { ClothingComponent } from './features/clothing/clothing.component';
import { SearchComponent } from './features/search/search.component';
import { BlogComponent } from './features/blog/blog.component';

import { CartComponent } from './features/cart/cart.component';

import { LoginRegistrationComponent } from './core/login-registration/login-registration.component';
import { MyAccountComponent } from './features/my-account/my-account.component';
import { LogoutComponent } from './core/logout/logout.component';

import { FooterComponent } from './core/footer/footer.component';

import { CookiePolicyComponent } from './features/cookie-policy/cookie-policy.component';
import { PrivacyPolicyComponent } from './features/privacy-policy/privacy-policy.component';
import { ChatComponent } from './features/chat/chat.component';

export const routes: Routes = [

    {path: 'home', component: HomeComponent},
    {path: 'bikes', component: BikesComponent},
    {path: 'components', component: ComponentsComponent},
    {path: 'accessories', component: AccessoriesComponent},
    {path: 'clothing', component: ClothingComponent},
    {path: 'search', component: SearchComponent},
    {path: 'blog', component: BlogComponent},    

    {path: 'cart', component: CartComponent},

    {path: 'chat', component: ChatComponent}, //SIGNAL R 24/05/2024
    
    {path: 'login&registration', component: LoginRegistrationComponent},
    {path: 'myAccount', component: MyAccountComponent},
    {path: 'logout', component: LogoutComponent},

    {path: 'footer', component: FooterComponent},

    {path: 'cookie-policy', component: CookiePolicyComponent},
    {path: 'privacy-policy', component: PrivacyPolicyComponent},

    {path: '', redirectTo: 'home', pathMatch: 'full' }, //Reindirizza alla pagina home 
];
