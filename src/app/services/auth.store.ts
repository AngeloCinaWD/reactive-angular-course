import { Injectable } from "@angular/core";
import { User } from "../model/user";
import { BehaviorSubject, Observable } from "rxjs";
import { map, shareReplay, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { json } from "body-parser";

// vogliamo fare in modo che se un utente si è loggato e si faccia il refresh della pagina non bisogna ripetere il login
// per farlo memorizziamo i dati dell'utente che si logga nella localStorage del browser, questa accetta solo valori che siamo stringhe, quindi andremo a trasformare in json i dati dell'utente quando si logga e li salveremo in una proprietà della localStorage
// i dati li elimineremo dalla localStorage quando l'utente effettuerà il logout manualmente
// definiamo una const con i nome della proprietà che vogliamo utilizzare per memorizzare i dati di autenticazione
// ogni volta che verrà istanziato lo store controllo se è presente questa proprietà nel localStorage, se lo è ne prendo il valore, lo parso in un oggetto User e lo faccio emettere al subject
const AUTH_DATA: string = "auth_data";

// global singleton pattern, quindi una sola istanza per questo service disponibile per tutta l'app
// proprietà provideIn: "root"
@Injectable({
  providedIn: "root",
})
export class AuthStore {
  // questo store gestisce in memoria i dati dell'utente e della sua autenticazione

  // per gestire il valore emesso dagli observable utilizziamo i BehaviorSubject
  // il primo restituisce un observable User ed inizialmente ha valore null
  private subject = new BehaviorSubject<User>(null);

  //   creiamo le public API
  // creo uno user profile Observable<User>
  // lo collego al subject
  user$: Observable<User> = this.subject.asObservable();

  // ho bisogno di un altro Observable, di tipo booleano, che emettere un true quando l'utente è loggato ed un false quando l'utente non lo è
  isLoggedIn$: Observable<boolean>;

  // un altro Observable<Boolean> lavora al contrario di isLoggedIn$
  isLoggedOut$: Observable<boolean>;

  // inietto l'HttpClient
  constructor(private http: HttpClient) {
    // quando viene istanziato il service dò il valore che dovranno emettere agli altri 2 observables secondo il valore che emetterà l'observable user$
    // utilizzo il map() operator per convertire user$ che è un oggetto in un valore booleano, col doppio punto esclamativo se l'oggetto esiste ottengo un true, se non esiste ottengo un false
    this.isLoggedIn$ = this.user$.pipe(map((user) => !!user));

    // l'observable isLoggedOut$ è il contrario di isLoggedIn$
    this.isLoggedOut$ = this.isLoggedIn$.pipe(map((loggedIn) => !loggedIn));

    // controllo se esiste la proprietà AUTH_DATA nel localStorage
    const user = localStorage.getItem(AUTH_DATA);

    // se esiste ne parso il valore e lo faccio emettere al subject
    if (user) {
      this.subject.next(JSON.parse(user));
    }
  }

  // il metodo login riceve 2 parametri: email e password, tutti e 2 stringhe
  // ritorna un Observable<User> in caso di riuscito login ed un error in caso di login negato
  login(email: string, password: string): Observable<User> {
    // chiamata http post ad /api/login
    // il payload è un oggetto che sarà convertito in json contenente email e password
    // this.http.post<Observable<User>>("/api/login", {email: email, password: password});
    //quando proprietà e value in un oggetto hanno lo stesso nome posso passare senza specificare key e value
    // evitiamo chiamate multiple con lo shareReplay() operator
    // tramite tap() operator facciamo emettere a subject lo User (isLoggedIn$ emetterà true, isLoggedOut$ emetterà false)
    // ritorniamo la chiamata
    return this.http.post<User>("/api/login", { email, password }).pipe(
      tap((user) => {
        this.subject.next(user);
        // dopo il login prendiamo i dati dell'utente ritornati dal BE e li memorizziamo nella localStorage tramite metodo setItem()
        // i dati li trasformiamo in un json
        localStorage.setItem(AUTH_DATA, JSON.stringify(user));
      }),
      shareReplay()
    );
  }

  // altro metodo è logout che non ha parametri
  // ci basta far emettere al subject il valore null, in questo modo user$ emetterà null, isLoggedIn$ emetterà false e isLoggedOut$ emetterà true
  logout() {
    this.subject.next(null);
    // eliminiamo la proprietà AUTH_DATA dal localStorage
    localStorage.removeItem(AUTH_DATA);
  }
}
