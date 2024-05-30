import { Component, OnInit, HostListener, Renderer2, ElementRef  } from '@angular/core';
import { CommonModule} from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cookie-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cookie-banner.component.html',
  styleUrl: './cookie-banner.component.css'
})
export class CookieBannerComponent implements OnInit {
[x: string]: any; //penso sia cone in C# quando usi Interfacce

  cookieConsent: string | null = null; //da capire la sintassi
  showPreferences: boolean = false;
  //in pratica mi salvo in un cookie l'accettazione o meno dei cookies
  //ho visto che si fa così, ho fatto una prova con altri siti e se premo "Rifiuta" ne genera alcuni
  //in modo tale che quando farò l'accesso la prossima volta si ricorda di me che ho rifiutato 
  //questo sicuramente dipende dalla durata che gli ho impostato (cioè quando gli chiederò la prossima volta il consenso)

 //per interecettare il click al di fuori del banner - deve essere visto come un rifiuta cookies
  constructor(private renderer: Renderer2, private elRef : ElementRef, private router: Router) {} 

  ngOnInit(): void {
    this.cookieConsent = this.getCookie('user_consent'); //vado a vedere che valore c'è associato a 'user_consent'
    if (!this.cookieConsent) { //se non esiste un valore intercetta il click
      this.renderer.listen('document', 'click', this.handleOutsideClick.bind(this));
    }
    else{ //serve per togliere l'intercettazione del click
    }
  }

  acceptCookies(event: MouseEvent): void { //ha premuto il pulsante "Accetta"
    event.stopPropagation() //evita di intercettare il click sul bottone come se fosse fuori dal banner
    this.setCookie('user_consent', 'accepted', 30);  //ho messo 30 min ai fini della presentazione finale anche se la durata massima è di 365 giorni (1 anno)
    this.cookieConsent = 'accepted';  //mi salvo nella variabile che ha accettato i cookies
    window.location.reload();
  }

  rejectCookies(): void {
    this.setCookie('user_consent', 'rejected', 30) //ho messo 30 min ai fini della presentazione finale
    this.cookieConsent = 'rejected';  //mi salvo nella variabile che ha rifiutato i cookies
    window.location.reload();
  }

  choosePreferences(event: MouseEvent): void {
    this.showPreferences = !this.showPreferences;
    event.stopPropagation() //evita di intercettare il click sul bottone come se fosse fuori dal banner
  }


  setCookie(name: string, value: string, days: number) : void {
    const date = new Date();
    //prendo la data di oggi e gli aggiungo il tempo di permanenza settato nel formato giorni, ore, minuti, secondo, millisecondi
    date.setTime(date.getTime() + (days *60*1000));//(days * 24 *60 *60 *1000)); //in realtà dovrei usare questo ma siccome per la 
                                                                      //presentazione finale ho bisogno dei minuti l'ho commentato

    const expires = "Expires=" + date.toUTCString(); //gli metto la data con il nostro fusorario.
    document.cookie = name + "=" + value + ";" + expires + ";path=/"; //me lo costruisco così
  }

  getCookie(name: string) : string | null { //return string or null
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for ( let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) 
          return c.substring(nameEQ.length, c.length);
    }

    return null;
  }


  handleOutsideClick(event: MouseEvent): void {
    let clickedInside = this.elRef.nativeElement.contains(event.target); //va a vedere se il click è avvenuto all'interno del banner
    if (!clickedInside) { //altrimenti sarà false e quindi di default rifiuta i cookies
      this.rejectCookies();
    }
  }

  a(event: MouseEvent) : void {
    event.stopPropagation()
  }


  redirectToPolicy()
  {
    this.router.navigate(['cookie-policy']);
  }
}
