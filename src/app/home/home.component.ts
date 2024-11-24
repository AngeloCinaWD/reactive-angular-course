import { Component, OnInit } from "@angular/core";
import { Course, sortCoursesBySeqNo } from "../model/course";
import { interval, noop, Observable, of, throwError, timer } from "rxjs";
import {
  catchError,
  delay,
  delayWhen,
  filter,
  finalize,
  map,
  retryWhen,
  shareReplay,
  tap,
} from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { CourseDialogComponent } from "../course-dialog/course-dialog.component";
import { CoursesService } from "../services/courses.service";
import { LoadingService } from "../services/loading.service";
import { MessagesService } from "../services/messages.service";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;

  constructor(
    private coursesService: CoursesService,
    private loadingService: LoadingService,
    private messagesService: MessagesService
  ) {}

  // finora la nostra app è stateless, cioè non tiene in memoria nulla dei dati che mostriamo, ma questi vengono ogni volta ricaricati tramite chiamate http al BE
  // questo è possibile notarlo ad esempio uscendo dalla homepage verso un'altra pagina e tornando alla home si attiva lo spinner di caricamento che è impostato per attivarsi durante il fetching dei dati dal BE
  // un continuo effettuarsi di chiamate http verso il be potrebbe, in alcune app, provocare dei rallentamenti e non avere così una ottimale UserExperience. In questi casi è utilie gestire i dati, implementare uno State Management, cioè memorizzare i dati provenienti dal BE in aree facilmente raggiungibili da tutte le componenti della nostra app
  // implementare uno state management è consigliato in quei casi in cui si abbiano connessioni lente e tempi di risposta dilatati dal BE
  ngOnInit() {
    this.reloadCourses();
  }

  reloadCourses() {
    const courses$: Observable<Course[]> = this.coursesService
      .loadAllCourses()
      .pipe(
        map((courses) => courses.sort(sortCoursesBySeqNo)),
        catchError((err) => {
          const message = "Could not load courses";
          this.messagesService.showErrors(message, err.error.message);
          return throwError(err);
        })
      );

    const loadCourses$ = this.loadingService.showLoaderUntilCompleted(courses$);

    this.beginnerCourses$ = loadCourses$.pipe(
      map((courses) =>
        courses.filter((course) => course.category === "BEGINNER")
      )
    );

    this.advancedCourses$ = loadCourses$.pipe(
      map((courses) =>
        courses.filter((course) => course.category === "ADVANCED")
      )
    );
  }
}
