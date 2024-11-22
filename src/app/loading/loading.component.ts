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
  constructor(private loadingService: LoadingService) {}

  ngOnInit() {}
}
