import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { Message } from "../model/message";
import { tap } from "rxjs/operators";

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

  constructor() {}

  ngOnInit() {}

  // il metodo onClose() setta il valore di showMessages a false
  onClose() {
    this.showMessages = false;
  }
}
