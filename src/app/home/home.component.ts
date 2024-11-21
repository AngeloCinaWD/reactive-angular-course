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
  beginnerCourses: Course[];

  advancedCourses: Course[];

  // l'HttpClient non serve più qui, serve iniettare il CoursesService
  // constructor(private http: HttpClient, private dialog: MatDialog) {}
  constructor(
    private coursesService: CoursesService,
    private dialog: MatDialog
  ) {}

  // spostiamo la logica che ora è nel componente in un service:
  // ng g s services/courses --project reactive-angular-course --skip-tests
  ngOnInit() {
    // chiamiamo il metodo per fetchare i Course dal BE implementato nel CoursesService
    // il nostro componente non sa da dove provengono i dati, li riceve e basta
    //questa non serve più, non chiamiamo direttamente da qui il BE
    // this.http.get("/api/courses").subscribe((res) => {
    //   const courses: Course[] = res["payload"].sort(sortCoursesBySeqNo);
    //   this.beginnerCourses = courses.filter(
    //     (course) => course.category == "BEGINNER"
    //   );
    //   this.advancedCourses = courses.filter(
    //     (course) => course.category == "ADVANCED"
    //   );
    // });
  }

  editCourse(course: Course) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "400px";

    dialogConfig.data = course;

    const dialogRef = this.dialog.open(CourseDialogComponent, dialogConfig);
  }
}
