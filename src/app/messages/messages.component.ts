import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { Message } from "../model/message";
import { tap } from "rxjs/operators";
import { MessagesService } from "../services/messages.service";

@Component({
  selector: "messages",
  templateUrl: "./messages.component.html",
  styleUrls: ["./messages.component.css"],
})
export class MessagesComponent implements OnInit {
  // proprietà che determina se visualizzare o no il MessageComponent
  // questa proprietà avrà valore true quando avremo un errore da qualche parte della nostra app
  // implementiamo quindi un service che vada a gestire questo valore
  showMessages = false;

  // implementiamo un Observable errors$ qui, che dipenderà da quello nel service
  // la sottoscrizione a questo è fatta direttamente nel template
  errors$: Observable<string[]>;

  // il service iniettato deve essere public per poter essere richiamato direttamente nel template
  constructor(public messagesService: MessagesService) {}

  ngOnInit() {
    // valorizziamo l'errors$ con il valore emesso dall'observable errors$ del service
    // quando quello del service emetterà un valore che non sia un array vuoto, quindi ci sono errori, settiamo la proprietà showMessages su true, tramite tap() RxJS operator
    this.errors$ = this.messagesService.errors$.pipe(
      tap(() => (this.showMessages = true))
    );
  }

  // il metodo onClose() setta il valore di showMessages a false
  onClose() {
    this.showMessages = false;
  }
}
