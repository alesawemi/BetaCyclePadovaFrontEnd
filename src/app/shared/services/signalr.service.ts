import { Injectable } from "@angular/core";
import * as signalR from '@microsoft/signalr';


@Injectable({
    providedIn: 'root'
})

export class SignalrService {

    //! è un'assegnamento assertivo (assigment assertion), cioè quelle che ti sto dicendo 
    //è che questa proprietà comunque sarà in qualche modo assegnata
    private hubConnection!: signalR.HubConnection; //so che necessiti di assegnaziona ma tranquillo che lo farò

    public startConnection = () => {
        this.hubConnection = new signalR.HubConnectionBuilder() //ecco qui l'inizializzazione
                                .withUrl("https://localhost:7247/Chat")
                                .build(); //creo l'oggetto

        this.hubConnection
        .start() //lo faccio partire
        .then(() => console.log('Connessione signalR avviata')) //se funziona
        .catch(err => console.log('Errore connessione signalR: ' + err)); //se non funziona
    };

    public AddTransferDataListener = (callback: (user: any, msg: any) => void) =>{
        this.hubConnection.on("ReceiveMessage", (user, msg) => { //vai a vedere "ReceiveMessage" e mostrami user e msg
            callback(user, msg)
        })
    }

    public sendMessage = (user: string, message: string) => {
        this.hubConnection.invoke("SendMessage", user, message) //mando user e msg e lo associo a ReceiveMessage
        .catch(err => console.log("Errore invio signalR messaggio: "+err))
    }
}