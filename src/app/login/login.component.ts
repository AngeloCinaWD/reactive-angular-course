import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { Router } from "@angular/router";
import { AuthStore } from "../services/auth.store";
import { catchError } from "rxjs/operators";
import { MessagesService } from "../services/messages.service";
import { throwError } from "rxjs";

@Component({
  selector: "login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authStore: AuthStore
  ) {
    this.form = fb.group({
      email: ["test@angular-university.io", [Validators.required]],
      password: ["test", [Validators.required]],
    });
  }

  ngOnInit() {}

  login() {
    const val = this.form.value;

    this.authStore.login(val.email, val.password).subscribe(
      () => this.router.navigateByUrl("/courses")
      // l'errore lo gestisco nell'authstore, in modo da utilizzare il MessagesService e far apparire un messaggio di errore nel pannello
      // (err) => {
      //   console.log(err);
      //   alert("Login failed");
      // }
    );
  }
}
