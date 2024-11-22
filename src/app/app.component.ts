import { Component, OnInit } from "@angular/core";
import { LoadingService } from "./services/loading.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  // registro qui il LoadingService, questo vuol dire che questa istanza sarà visibile solo all'app component ed ai suoi child
  providers: [LoadingService],
})
export class AppComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  logout() {}
}
