import { Injectable } from "@angular/core";
import { User } from "../model/user";
import { Observable } from "rxjs";

// global singleton pattern, quindi una sola istanza per questo service disponibile per tutta l'app
// proprietà provideIn: "root"
@Injectable({
  providedIn: "root",
})
export class AuthStore {
  // questo store gestisce in memoria i dati dell'utente e della sua autenticazione

  //   creiamo le public API
  // creo uno user profile Observable<User>
  user$: Observable<User>;

  // ho bisogno di un altro Observable, di tipo booleano, che emettere un true quando l'utente è loggato ed un false quando l'utente non lo è
  isLoggedIn$: Observable<boolean>;

  // un altro Observable<Boolean> lavora al contrario di isLoggedIn$
  isLoggedOut$: Observable<boolean>;

  // il metodo login riceve 2 parametri: email e password, tutti e 2 stringhe
  // ritorna un Observable<User> in caso di riuscito login ed un error in caso di login negato
  login(email: string, password: string): Observable<User> {}

  // altro metodo è logout che non ha parametri
  logout() {}
}
