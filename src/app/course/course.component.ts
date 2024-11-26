import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Course } from "../model/course";
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  tap,
  delay,
  map,
  concatMap,
  switchMap,
  withLatestFrom,
  concatAll,
  shareReplay,
  catchError,
} from "rxjs/operators";
import {
  merge,
  fromEvent,
  Observable,
  concat,
  throwError,
  combineLatest,
} from "rxjs";
import { Lesson } from "../model/lesson";
import { CoursesService } from "../services/courses.service";

interface CourseData {
  course: Course;
  lessons: Lesson[];
}

@Component({
  selector: "course",
  templateUrl: "./course.component.html",
  styleUrls: ["./course.component.css"],
})
export class CourseComponent implements OnInit {
  data$: Observable<CourseData>;

  constructor(
    private route: ActivatedRoute,
    private coursesService: CoursesService
  ) {}

  ngOnInit() {
    const courseId = parseInt(this.route.snapshot.paramMap.get("courseId"));

    // implementato così avremo sempre un momento in cui la pagina è bianca perchè il combineLatest() aspetta che tutti e 2 gli observables siano completati ed emettano un valore per emettere un valore del nuovo observable che crea
    // utilizzando sui 2 observables l'operatore RxJS startWith(), forziamo l'observable ad emettere un valore iniziale, in questo modo combineLatest() inizierà ad emettere il suo e nella pagina si inizierà a vedere qualcosa
    const course$ = this.coursesService
      .loadCourseById(courseId)
      // gli facciamo emettere null inizialmente
      .pipe(startWith(null));

    const lessons$ = this.coursesService
      .loadAllCourseLessons(courseId)
      // gli facciamo emettere un array vuoto inizialmente
      .pipe(startWith([]));

    this.data$ = combineLatest([course$, lessons$]).pipe(
      map(([course, lessons]) => {
        return { course, lessons };
      }),
      tap(console.log)
    );
  }
}
