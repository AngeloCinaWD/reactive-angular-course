import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable()
export class LoadingService {
  constructor() {
    // const ciao = this.loading$.subscribe((val) => console.log(val));
    // ciao.unsubscribe();
    // this.loadingSubject.next(true);
  }

  // per definire custom observable di solito si utilizzano i Subject di rxjs
  // un Subject è una classe di rxjs e ci permette di definire cosa un observer deve emettere
  // uno speciale Subject è il BehaviorSubject che ha la particolarità di ricordare quale è l'ultimo valore emesso, in questo modo chiunque si sottoscriva riceverà l'ultimo valore emesso anche se non è stato emesso nulla di nuovo
  // istanziamo un BehaviorSubject di tipo booleano, con initial value false

  private loadingSubject = new BehaviorSubject<boolean>(false);

  // dato che il BehaviorSubject è come un Observable ma con la differenza che può essere controllato, cioè posso fargli emettere nuovi valori, voglio che la sottoscrizione si possa fare solo ad un Observable che invece non può essere gestito, ma che emetta il valore che emette il BehaviorSubject
  // questo posso farlo utilizzando il metodo .asObservable() dei Subject di RxJS, che crea un Observable tenendolo collegato al Subject di origine
  // loading$: Observable<boolean>;
  // questo observable all'inizio emette false e lo spinner non si visualizza
  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  showLoaderUntilCompleted<T>(obs$: Observable<T>): Observable<T> {
    // per il momento ritorna undefined per non avere errore
    return undefined;
  }

  loadingOn() {
    // facciamo in modo che il subject loadingSubject emetta un nuovo valore, true
    this.loadingSubject.next(true);
  }

  loadingOff() {
    // facciamo in modo che il subject loadingSubject emetta un nuovo valore, false
    this.loadingSubject.next(false);
  }
}
