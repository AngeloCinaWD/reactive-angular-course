import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { Course, sortCoursesBySeqNo } from "../model/course";
import { catchError, map, shareReplay, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { LoadingService } from "./loading.service";
import { MessagesService } from "./messages.service";

// lo store deve generare una sola istanza globale per tutta l'app, non ha senso fare più istanze
@Injectable({
  providedIn: "root",
})
export class CoursesStore {
  // per implementare un custom observable utilizziamo un BehaviorSubject
  // i dati vengono memorizzati qui nel subject, il BehaviorSubject ha la particolarità di tenere in memoria l'ultimo valore emesso, quindi in caso di sottoscrizione a questo, in qualsiasi altra parte dell'app, si avranno sempre gli ultimi dati emessi e quindi uguali
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

  // implementiamo un metodo public per le modifiche ai corsi
  // lo facciamo in Optimistic Way, cioè modifichiamo i dati direttamente in memoria nell'app ed andiamo ad emettere il nuovo valore, non attendiamo che vengano salvati nel BE prima di notificare il nuovo valore all'app
  // non avremo bisogno quindi di mostrare uno spinner di caricamento, lo store avverrà in background
  // 2 parametri: l'id del corso ed i changes
  // ritornas un Observable di qualsiasi tipo perchè potrebbe essere un Course o un error
  // questo metodo deve gestire due cose: agiornare i dati in memoria nell'app e salvarli nel BE
  // per visualizzare il pannello di errore nella finestra di dialogo dovrei passarlo come terzo argomento al momento della chiamata del metodo di questo service
  // saveCourse(
  //   courseId: string,
  //   changes: Partial<Course>,
  //   messageServicePassatoComeArgomento: MessagesService
  // ): Observable<any>
  saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
    // creo una const con i dati memorizzati nel BehaviorSubject, questa per inference di TS avrà type Course[]
    // il metodo getValue() di un BehaviorSubject mi dà l'ultimo valore emesso da questo
    const courses = this.subject.getValue();

    // identifichiamo il corso che vogliamo modificare, utilizziamo l'array method findIndex() che restituisce l'indice del primo elemento di un array che rispetta una determinata condizione
    const index = courses.findIndex((course) => course.id === courseId);

    // creo un nuovo Course con le modifiche inviate
    const newCourse: Course = {
      // corso da modificare ricavato per id
      ...courses[index],
      // modifiche da apportare
      ...changes,
    };

    // creiamo un nuovo Courses[], con il corso modificato al posto del vecchio
    // creo una copia tramite array method .slice(), questo crea un nuovo array con una porzione dell'array al quale viene applicato, passando l'indice dell'elemento dal quale si vuole copiare, passando 0 gli dico di copiare tutto l'array
    const newCourses: Course[] = courses.slice(0);

    // in questo array copiato sostituisco l'oggetto Course modificato, indicato per index, con quello nuovo modificato
    newCourses[index] = newCourse;

    // ora faccio emettere al subject il nuovo array
    this.subject.next(newCourses);

    // inviamo i dati da modificare al BE e ritorniamo l'observable come output del saveCourse()
    // gestiamo l'errore con il catchError() di RxJS
    // utilizziamo l'operatore RxJS shareReplay() per evitare chiamate http multiple
    return this.http.put(`/api/courses/${courseId}`, changes).pipe(
      catchError((err) => {
        const message = "Could not save course.";
        // in caso di errore se volessi mostrarlo nella finestra di dialogo dovrei utilizzare il metodo showErrors del MessagesService passato al momento della chiamata del metodo saveCourse() che è l'istanza di quello a cui riferisce il compoennte CourseDialogComponent
        // messageServicePassatoComeArgomento.showErrors(message);
        // se utilizzo questo sto utilizzando quello registrato nei providers di app.module e quindi visibile nell'app.component ed i suoi figli diretti, il pannello di errore sarà visualizzato nella pagina HomeComponent
        this.messagesService.showErrors(message);
        // in caso di errore devo far emettere al subject il vecchio array dei corsi altrimenti avrò nell'app i dati modificati e nel BE i dati non modificati
        this.subject.next(courses);
        return throwError(err);
      }),
      shareReplay()
    );
  }
}
