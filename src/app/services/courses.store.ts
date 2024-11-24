import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Course, sortCoursesBySeqNo } from "../model/course";
import { map } from "rxjs/operators";

// lo store deve generare una sola istanza globale per tutta l'app, non ha senso fare più istanze
@Injectable({
  providedIn: "root",
})
export class CoursesStore {
  // l'API pubblica sarà sempre un oggetto reattivo, un observable di Course[]
  courses$: Observable<Course[]>;

  // vanno implementati metodi per la gestione ed utilizzo dei dati memorizzati nello store
  // metodo che permette di filtrare i Course per categoria, accetta come argomento una stringa e restituisce un Observable di Course[] oridnato per sequence number
  filterByCategory(category: string): Observable<Course[]> {
    return this.courses$.pipe(
      map((courses) =>
        courses
          .filter((course) => course.category === category)
          .sort(sortCoursesBySeqNo)
      )
    );
  }
}
