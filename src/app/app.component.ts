import { Component, OnInit } from "@angular/core";
import { LoadingService } from "./services/loading.service";
import { MessagesService } from "./services/messages.service";
import { AuthStore } from "./services/auth.store";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  constructor(public authStore: AuthStore) {}

  ngOnInit() {}

  logout() {
    this.authStore.logout();
  }
}
