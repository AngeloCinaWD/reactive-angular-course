import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { Course, sortCoursesBySeqNo } from "../model/course";
import { catchError, map, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { LoadingService } from "./loading.service";
import { MessagesService } from "./messages.service";

// lo store deve generare una sola istanza globale per tutta l'app, non ha senso fare più istanze
@Injectable({
  providedIn: "root",
})
export class CoursesStore {
  // per implementare un custom observable utilizziamo un BehaviorSubject
  private subject: BehaviorSubject<Course[]> = new BehaviorSubject([]);

  // diamo l'abilità all'observable courses$ di emettere nuovi valori
  // l'API pubblica sarà sempre un oggetto reattivo, un observable di Course[]
  courses$: Observable<Course[]> = this.subject.asObservable();

  // per fetchare i dati dal BE ho bisogno di iniettare l'HttpClient, il LoadingService ed il MessageService
  // questi ultimi 2 services devono essere registrati nell'app module per poter essere utilizzati qui
  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    private messagesService: MessagesService
  ) {
    // all'istanza dello store fetcho i dati dal BE
    // metodo privato non accessibile dall'esterno
    this.loadAllCourses();
  }

  private loadAllCourses() {
    // fetcho i dati dal BE, ricevo un observable Course[] e lo salvo in una const
    const loadCourses$: Observable<Course[]> = this.http
      .get<Course[]>("/api/courses")
      .pipe(
        // estraggo la property payload in modo da avere un array di Course
        map((response) => response["payload"]),
        // dobbiamo gestire gli errori
        catchError((err) => {
          const message = "Could not load courses";
          // li mostriamo tramite MessagesService
          this.messagesService.showErrors(message);
          return throwError(err);
        }),
        // tramite tap faccio emettere al subject un nuovo valore, i corsi scaricati, che verranno emessi dall'observable courses$
        // secondo me si può fare dopo aver mostrato lo spinner nel subscribe del this.loadingService.showLoaderUntilCompleted(loadCourses$) perchè comunque torna un Observable<Course[]>
        tap((courses) => this.subject.next(courses))
      );

    // l'observable loadCourses$ lo passiamo al metodo per lo spinner di caricamento nel LoadingService che ritorna un Observable
    // devo effettuare la subscription
    this.loadingService
      .showLoaderUntilCompleted(loadCourses$)
      // .subscribe((courses) => this.subject.next(courses));
      .subscribe();
  }

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
