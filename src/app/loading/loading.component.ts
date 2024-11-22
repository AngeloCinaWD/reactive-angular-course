import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { LoadingService } from "../services/loading.service";

@Component({
  selector: "loading",
  templateUrl: "./loading.component.html",
  styleUrls: ["./loading.component.css"],
})
export class LoadingComponent implements OnInit {
  // iniettiamo il LoadingService
  // constructor(private loadingService: LoadingService) {}
  // per far si che il service sia utilizzabile anche nel template dobbiamo rendere la proprietà public
  constructor(public loadingService: LoadingService) {}

  ngOnInit() {}
}
