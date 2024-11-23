import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { concatMap, finalize, tap } from "rxjs/operators";

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

  // questo metodo ritorna un observable, il tipo di observable che ritornerà non ha un type definito, lo avrà per inference di TS, restituirà un observable del type dell'observable che gli passiamo quando lo chiamiamo
  showLoaderUntilCompleted<T>(obs$: Observable<T>): Observable<T> {
    // implementiamo il metodo in modo che lavori su qualsiasi tipo di observable passato al metodo
    // per prima cosa creiamo un altro observable, utilizziamo il metodo RxJS of() che restituisce un observable dall'argomento passato
    // l'observable iniziale ha valore null e con il tap operator indichiamo che il subject loadingSubject emetta un true
    // poi tramite concatMap() operator trassformiamo ed emttiamo l'observable iniziale null in quello passato come argomento al metodo. il concatMap() emette tutti gli observable che gli passiamo, uno dopo l'altro, man mano che si completano. Quindi il primo essendo null si completa subito e viene emesso il secondo Observable fino al suo cpmpletamento o fino ad un eventuale error
    // una volta emesso utilizziamo il finalize() operator per indicare che il subject loadingSubject emetta un false
    // il valore che ritorniamo è un Observable del type di quello passato come argomento
    // lo spinner di caricamento in questo modo è completamente dipendente dal lifecycle dell'observable passato come argomento
    return of(null).pipe(
      tap(() => this.loadingOn()),
      concatMap(() => obs$),
      finalize(() => this.loadingOff())
    );
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
