import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

// @Injectable({
//   providedIn: 'root'
// })
// non passiamo la proprietà providedIn perchè non vogliamo utilizzare per lo spinner il singleton pattern, non una sola istanza
// infatti potremmo utilizzare lo spinner di caricamento in diverse parti contemporaneamente, ad esempio per indicare che ci sono operazioni in background e non vogliamo bloccare l'app nel frattempo
// dobbiamo quindi andare a definire dove è disponibile questo service per poterlo iniettare tramite dependency injection
// lo registriamo nei providers di app.component.ts
@Injectable()
export class LoadingService {
  constructor() {}

  // utilizziamo un Observable boolean come public API di questo service, questo observable emetterà true quando vogliamo visualizzare lo spinner di caricamento e false quando non si deve visualizzare
  loading$: Observable<boolean>;

  // dobbiamo fare in modo che ci sia un modo per indicare al service che valore deve emettere l'observable loading$, se true o false, in modo che dove c'è la sottoscrizione a questo observable riceva il valore per visualizzare o no lo spinner di caricamento (ad esempio prima o dopo di fetchare dati dal BE)
  // creiamo un metodo che ci permetta di attivare o disattivare lo spinner direttamente con il lifecycle di un observable qualsiasi
  // questo metodo sarà di tipo generico T, riceverà come argomento un observable generico di tipo T e ritornerà un observable generico di tipo T. In questo modo potrà funzionare con qualsiasi tipo di observable
  showLoaderUntilCompleted<T>(obs$: Observable<T>): Observable<T> {
    // per il momento ritorna undefinede per non avere errore
    return undefined;
  }

  // implementiamo 2 metodi loadingOn() e loadingOff() per attribuire true o false come value da emettere all'observable loading$
  loadingOn() {}

  loadingOff() {}
}
