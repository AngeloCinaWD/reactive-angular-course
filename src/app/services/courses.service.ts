import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Course } from "../model/course";
import { map, shareReplay } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class CoursesService {
  constructor(private http: HttpClient) {}

  // in caso di Observable ottenuti tramite HttpClient module, le richieste al BE vengono effettuate in lazy loading, cioè effettuate solo se si fa una sottoscrizione
  // utilizzando l'RxJS operator shareReplay() otteniamo che per lo stesso observable si possono avere più sottoscrizioni ma la request http sarà solo una, il risultato verrà condiviso da tutte le sottoscrizioni, non si avrà così una request http per ogni sottoscrizione effettuata
  // questo operatore è utilizzabile solo in questi specifici tipi di services, quelli in cui si utilizza l'angular HttpClient
  loadAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>("/api/courses").pipe(
      map((valoreOriginale) => valoreOriginale["payload"]),
      shareReplay()
    );
  }

  // metodo per modificare il corso, chiamata http in put
  // accetta l'id del corso da modificare e i dati che devono essere cambiati
  // ritorna un observable di tipo any
  saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
    return (
      this.http
        .put(`/api/courses/${courseId}`, changes)
        // mi assicuro che non venga effettuata più di una request http anche in caso di più sottoscrizioni all'observable
        .pipe(shareReplay())
    );
  }
}
