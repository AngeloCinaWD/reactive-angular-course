import { Injectable } from "@angular/core";

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
}
