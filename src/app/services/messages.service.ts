import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { filter } from "rxjs/operators";

// @Injectable({
//   providedIn: 'root'
// })
// questo service potrà avere diverse istanze, per diverse parti dell'app
// questo service saprà se ci sono errori nel caricamento di un observable ed informerà il MessagsComponent che potrà essere renderizzato e quindi mostrare gli errori
// ogni MessagesComponent farà riferimento ad una sua istanza del service a seconda di quale template si trova
// il service è iniettato naturalmente anche nel MessagesComponent che avrà una sua istanza che farà riferimento ad una specifica istanza del service
@Injectable()
export class MessagesService {
  // per implementare l'observable errors creiamo un new BehaviorSubjcet, un subject RxJS che ha la facoltà di ricordare l'ultimo valore emesso e lo rende disponibile immediatamente al subscriber
  // è un array di stringhe, con valore iniziale array vuoto
  // ci permette di gestire cosa deve emettere l'observable errors$
  private subject = new BehaviorSubject<string[]>([]);

  // la public API del service è un observable di un array di stringhe
  // il componente MessagesComponent fa la sottoscrizione a questo Observable che emetterà un value in caso di presenza di errori
  // colleghiamo il nostro observable al BehaviorSubject in modo da poterlo gestire, utilizziamo il metodo asObservable() dei Subject RxJS
  // il nostro observable avrà come valore iniziale da emetter un array vuoto
  // errors$: Observable<string[]>;
  // errors$: Observable<string[]> = this.subject.asObservable();
  // dobbiamo però fare in modo che l'observable non abbia un valore falsy, non sia un array vuoto, vuol dire che non ci sono errori
  // lo facciamo utilizzando il filter() RxJS operator, che ci restituirà qualcosa secondo una condizione e cioè che il valore del Subject non sia un array vuoto e non sia falsy
  errors$: Observable<string[]> = this.subject
    .asObservable()
    .pipe(filter((errors) => errors && errors.length > 0));

  // implementiamo un metodo pubblico che riceve un array di stringhe
  // se vogliamo emettere un nuovo errors$ dobbiamo utlizzare questa API del service
  showErrors(...errors: string[]) {
    // diciamo con questo metodo che il valore da emettere del subject e quindi dell'observable errors$ sarà l'array di stringhe di errori che gli viene passato quando viene chiamato

    this.subject.next(errors);
  }
}
