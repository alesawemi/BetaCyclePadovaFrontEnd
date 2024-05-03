import { Component } from "@angular/core";
import { RouterModule } from '@angular/router';
import { HomeComponent } from "../home/home.component";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule,HomeComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

}