import { Component } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import {Route, RouterModule } from '@angular/router';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FooterComponent,RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
