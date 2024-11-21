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

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  beginnerCourses: Course[];

  advancedCourses: Course[];

  constructor(private http: HttpClient, private dialog: MatDialog) {}

  ngOnInit() {
    // tutte le chiamate dovrebbero iniziare con http://localhost:9000, ma le possiamo fare così perchè il comando strat è runnato per utilizzare un proxy configurato nel file proxy.json
    // nel proxy diciamo che tutte le rotte che iniziano con /api le riferiamo a http://localhost:9000, quindi il proxy completa l'url per noi
    this.http.get("/api/courses").subscribe((res) => {
      // riceviamo l'array di corsi, estraiamo la property payload che è un altro array di oggetti
      // la proprietà payload c'è perchè la mette lui quando risponde (vedere get-courses.route.ts)
      //  res.status(200).json({payload:Object.values(COURSES)});
      // la property payload ha come value un array, questo viene ordinato secondo un ordine
      const courses: Course[] = res["payload"].sort(sortCoursesBySeqNo);

      // tramite metodo filetr() ottengo 2 array secondo categoria
      this.beginnerCourses = courses.filter(
        (course) => course.category == "BEGINNER"
      );

      this.advancedCourses = courses.filter(
        (course) => course.category == "ADVANCED"
      );
    });
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
