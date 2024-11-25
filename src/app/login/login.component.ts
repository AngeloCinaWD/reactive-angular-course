import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { Router } from "@angular/router";
import { AuthStore } from "../services/auth.store";

// creiamo un nuovo file store per gestire l'autenticazione di un utente, quindi le operazioni di login e logout
// creiamo il file services/auth.store.ts
@Component({
  selector: "login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  form: FormGroup;

  // iniettiamo l'AuthStore per poterne utilizzare le API per gestire l'autenticazione
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authStore: AuthStore
  ) {
    this.form = fb.group({
      email: ["test@angular-university.i", [Validators.required]],
      password: ["test", [Validators.required]],
    });
  }

  ngOnInit() {}

  login() {
    // questa const contiene email e password
    const val = this.form.value;

    // chiamiamo il metodo login() dell'AuthStore e gli passiamo email e password
    // dobbiamo fare il subscribe perchè è un Observable
    this.authStore.login(val.email, val.password).subscribe(
      // se il login ha successo navighiamo verso la pagina con i Course
      () => this.router.navigateByUrl("/courses"),
      // se fallisce avrò un error ed avviso con un alert()
      (err) => {
        console.log(err);
        alert("Login failed");
      }
    );
  }
}
