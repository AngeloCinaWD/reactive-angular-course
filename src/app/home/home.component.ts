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

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;

  // vogliamo mostrare lo spinner di caricamento mentre vengono caricati i corsi dal BE
  // per farlo inietiiamo il LoadingService
  constructor(
    private coursesService: CoursesService,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.reloadCourses();
  }

  reloadCourses() {
    // non attivo più lo spinner direttamente. lo farò tramite metodo showLoaderUntilCompleted()
    // this.loadingService.loadingOn();

    // const courses$: Observable<Course[]> = this.coursesService
    //   .loadAllCourses()
    //   .pipe(
    //     map((courses) => courses.sort(sortCoursesBySeqNo)),
    //     // utilizzo l'operator RxJs finalize() per interrompere la visualizzazione dello spinner di caricamento
    //     // questo operatore interviene quando l'observable completa o restituisce error
    //     finalize(() => this.loadingService.loadingOff())
    //   );

    // tolgo il finalize(), questo Observable sarà solo un Corse[] ordinato
    const courses$: Observable<Course[]> = this.coursesService
      .loadAllCourses()
      .pipe(
        map((courses) => courses.sort(sortCoursesBySeqNo))
        // finalize(() => this.loadingService.loadingOff())
      );

    // utilizziamo lo spinner di caricamento con il metodo presente nel LoadingService, in modo da non stare a passare il finalize() a tutti gli Observable che utilizzeranno lo spinner di caricamento
    // il metodo ci ritornerà un Observable che sarà quello che andremo a sottoscrivere nel template
    // passiamo l'observable courses$ al metodo
    const loadCourses$ = this.loadingService.showLoaderUntilCompleted(courses$);

    // this.beginnerCourses$ = courses$.pipe(
    this.beginnerCourses$ = loadCourses$.pipe(
      map((courses) =>
        courses.filter((course) => course.category === "BEGINNER")
      )
    );

    // this.advancedCourses$ = courses$.pipe(
    this.advancedCourses$ = loadCourses$.pipe(
      map((courses) =>
        courses.filter((course) => course.category === "ADVANCED")
      )
    );
  }
}
