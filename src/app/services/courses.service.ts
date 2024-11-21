import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Course } from "../model/course";
import { map } from "rxjs/operators";

@Injectable({
  // questo indica che ci sarà una sola istanza di questo service disponibile per tutta l'app
  providedIn: "root",
})
export class CoursesService {
  // QUESTO SERVICE è STATELESS, NON CONTIENE DATI, RESTITUISCE OBSERVABLES CHE EMETTONO DATI
  // QUESTI DATI SONO ACCESSIBILI DA QUALSIASI PARTE DELL'APP FACENDO UN SUBSCRIBE A QUESTI OBSERVABLES
  // STATELESS, OBSERVABLE BASED SERVICE

  // iniettiamo l'HttpClient
  constructor(private http: HttpClient) {}

  // metodo per fetchare tutti i Course dal BE
  // vogliamo che ritorni un Observable con un array di Course
  // se la chiamata al BE avrà successo questa emetterà un solo valore di risposta
  loadAllCourses(): Observable<Course[]> {
    // chiamiamo il BE e in questo modo abbiamo già un Observable, l'HttpClient di NG dà come response un Observable
    // definiamo il tipo di dati che sarà contenuto nell'observable, quindi il tipo di dati che riceviamo dal BE
    // riceveremo un oggetto contenete una property payload che ha come value un array di Course
    // quindi quello che faremo è estrarre il contenuto di payload per avere il nostro Observable di Course[], altrimenti avremmo un Observable di un oggetto con dentro payload ed il suo value
    // per convertire un observable in un altro si utilizzano gli operators di RxJS, sono metodi concatenabili, passati come argomento al metodo .pipe()
    // il map() agisce su ogni singolo valore emesso dall'observable, in questo caso è solo un valore e vogliamo di questo valore ottenere un observable di output contenente il value della proprietà payload
    return this.http
      .get<Course[]>("/api/courses")
      .pipe(map((valoreOriginale) => valoreOriginale["payload"]));
  }
}
