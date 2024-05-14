import { Component } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import {Route, RouterModule } from '@angular/router';
import { CristianHomeComponent } from '../../../cristian-home/cristian-home.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FooterComponent,RouterModule,CristianHomeComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
