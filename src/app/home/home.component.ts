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

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;

  constructor(
    private coursesService: CoursesService
  ) // questo non serve e lo inietto nel CoursesCardListComponent
  // private dialog: MatDialog
  {}

  ngOnInit() {
    const courses$: Observable<Course[]> = this.coursesService
      .loadAllCourses()
      .pipe(map((courses) => courses.sort(sortCoursesBySeqNo)));

    // per questi 2 observables ho una chiamata http per ognuno, una per ogni sottoscrizione tramite async pipe
    // per evitare che si faccia più di una chiamata dobbiamo fare in modo che dopo la prima subscription il risultato venga salvato e messo a disposizione delle altre subscriptions
    // questo può essere fatto utilizzando l'operator RxJS shareReplay(), utilizzandolo nel pipe della request http nel metodo del service
    this.beginnerCourses$ = courses$.pipe(
      map((courses) =>
        courses.filter((course) => course.category === "BEGINNER")
      )
    );

    this.advancedCourses$ = courses$.pipe(
      map((courses) =>
        courses.filter((course) => course.category === "ADVANCED")
      )
    );
  }

  // questo metodo lo sposto nel CoursesCardListComponent
  // editCourse(course: Course) {
  //   const dialogConfig = new MatDialogConfig();

  //   dialogConfig.disableClose = true;
  //   dialogConfig.autoFocus = true;
  //   dialogConfig.width = "400px";

  //   dialogConfig.data = course;

  //   const dialogRef = this.dialog.open(CourseDialogComponent, dialogConfig);
  // }
}
