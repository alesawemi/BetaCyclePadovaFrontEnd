import { Component } from "@angular/core";
import { RouterModule } from '@angular/router';
import { HomeComponent } from "../home/home.component";
import { CommonModule } from "@angular/common";
import { AuthenticationService } from "../../shared/services/authentication.service";

import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule,HomeComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  showDropdown = false;

  constructor(public auth: AuthenticationService) {}
}