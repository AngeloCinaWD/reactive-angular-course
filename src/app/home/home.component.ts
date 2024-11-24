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

  // inietto il MessagesService
  constructor(
    private coursesService: CoursesService,
    private loadingService: LoadingService,
    private messagesService: MessagesService
  ) {}

  ngOnInit() {
    this.reloadCourses();
  }

  reloadCourses() {
    const courses$: Observable<Course[]> = this.coursesService
      .loadAllCourses()
      // per catturare eventuali errori di un observable utilizziamo l'operatore RxJS catchError()
      // questo operatore genera un nuovo observable con degli errori al posto dell'observable fallito
      .pipe(
        map((courses) => courses.sort(sortCoursesBySeqNo)),
        // dobbiamo ritornare un observable, lo facciamo creando un error observable tramite throwError() function RxJS che emetterà l'observable con l'argomento passatogli e terminerà la propria vita
        catchError((err) => {
          const message = "Could not load courses";
          // le stringhe passate come argomento al metodo saranno emesse dall'observable errors$ del service
          this.messagesService.showErrors(message, err.error.message);
          // per vedere all'opera il pannello con gli errori andiamo a forzare un error nel BE, nella API per il caricamento dei corsi
          // console.log(message, err);
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
