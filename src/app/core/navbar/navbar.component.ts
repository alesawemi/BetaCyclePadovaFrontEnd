import { Component } from "@angular/core";
import { RouterModule } from '@angular/router';
import { HomeComponent } from "../home/home.component";
import { CommonModule } from "@angular/common";
import { AuthenticationService } from "../../shared/services/authentication.service";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule,HomeComponent, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(public auth: AuthenticationService) {}
}