import { Component, OnInit } from "@angular/core";
import { LoadingService } from "./services/loading.service";
import { MessagesService } from "./services/messages.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  // devo registrare questi 2 services nell'app.module per poterli utilizzare negli store
  // providers: [LoadingService, MessagesService],
})
export class AppComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  logout() {}
}
