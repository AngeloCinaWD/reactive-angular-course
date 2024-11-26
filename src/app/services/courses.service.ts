import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Course } from "../model/course";
import { map, shareReplay } from "rxjs/operators";
import { Lesson } from "../model/lesson";

@Injectable({
  providedIn: "root",
})
export class CoursesService {
  constructor(private http: HttpClient) {}

  loadAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>("/api/courses").pipe(
      map((valoreOriginale) => valoreOriginale["payload"]),
      shareReplay()
    );
  }

  saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
    return this.http
      .put(`/api/courses/${courseId}`, changes)
      .pipe(shareReplay());
  }

  // implementiamo un metodo per cercare un determinato valore fra le lezioni nel BE
  // questo metodo accetta un parametro stringa e ritorna un Observable<Lesson[]>
  searchLessons(value: string): Observable<Lesson[]> {
    // chiamiamo il BE con una GET alla quale aggiungiamo fra le opzioni la proprietà params, un oggetto con i query parameters da aggiungere all'url (devono essere tutti value strings)
    // la chiamata get si aspetta di ricevere un array di Lesson che sarà il value dell'observable creato dall'HttpClient
    return this.http
      .get<Lesson[]>("/api/lessons", {
        params: {
          // i query params sono il filter col valore da cercare ed il pageSize che indica quanti risultati avere per pagina
          filter: value,
          pageSize: "100",
        },
      })
      .pipe(
        // la risposta dal BE ci dà un oggetto con una proprietà payload che è un array di Lesson, col map facciamo in modo che il value dell'observable sia direttamente questo array
        map((response) => response["payload"]),
        // facciamo in modo che non si abbiano multiple http request al BE
        shareReplay()
      );
  }
}
