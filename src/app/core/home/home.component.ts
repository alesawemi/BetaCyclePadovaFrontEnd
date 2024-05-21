import { Component } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import {Route, RouterModule } from '@angular/router';
import { CristianHomeComponent } from '../../../cristian-home/cristian-home.component';
import { OnInit } from '@angular/core';
import { NuoviArriviComponent } from '../carousels/NuoviArrivi/nuovi-arrivi/nuovi-arrivi.component';
import { PiuVendutiComponent } from '../carousels/PiuVenduti/piu-venduti/piu-venduti.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FooterComponent,RouterModule,CristianHomeComponent,NuoviArriviComponent,PiuVendutiComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit{
  phrases: string[] = [
    "Scegli la tua strada, scegli la tua bicicletta",
    "Ogni pedalata è un'avventura",
    "Libera la tua mente e il tuo spirito: pedala con noi!"
  ];
  currentPhrase: string = '';
  currentIndex: number = 0;

  constructor() { }

  ngOnInit(): void {
    this.showNextPhrase();
  }

  showNextPhrase(): void {
    this.currentPhrase = this.phrases[this.currentIndex];
    setTimeout(() => this.hideCurrentPhrase(), 5000);
    this.currentIndex = (this.currentIndex + 1) % this.phrases.length;
    setTimeout(() => {
      this.showPhrase();
    }, 1000);
  }
  
  showPhrase(): void {
    const overlayText = document.querySelector('.overlay-text');
    if (overlayText) {
      overlayText.classList.add('show');
      overlayText.classList.remove('hide'); // Rimuovi la classe hide se presente
    }
  }
  
  hideCurrentPhrase(): void {
    this.currentPhrase = '';
    setTimeout(() => this.showNextPhrase(), 2000);
    const overlayText = document.querySelector('.overlay-text');
    if (overlayText) {
      overlayText.classList.remove('show');
      overlayText.classList.add('hide'); // Aggiungi la classe hide per far uscire il testo
    }
  }
  
}