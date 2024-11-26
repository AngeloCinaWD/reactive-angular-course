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

// per il Single Data Observable Pattern abbiamo bisogno di implementare un'interface in cui indichiamo tutto quello che ci serve nel template
// potremmo fare un file .ts a parte ed esportare l'interface, ma la implementiamo direttamente qui nel componente perchè la utilizzeremo solo qui
// il template ha bisogno di un Course e di un Lesson[]
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
  // eliminiamo i 2 observable separati e ne definiamo uno che sarà type CourseData interface
  // course$: Observable<Course>;

  // lessons$: Observable<Lesson[]>;

  data$: Observable<CourseData>;

  constructor(
    private route: ActivatedRoute,
    private coursesService: CoursesService
  ) {}

  ngOnInit() {
    const courseId = parseInt(this.route.snapshot.paramMap.get("courseId"));

    // per valorizzare l'observable data$ dobbiamo combinare i 2 observables che avevamo in precedenza
    // salviamo gli observables in 2 const
    // this.course$ = this.coursesService.loadCourseById(courseId);

    // this.lessons$ = this.coursesService.loadAllCourseLessons(courseId);

    const course$ = this.coursesService.loadCourseById(courseId);

    const lessons$ = this.coursesService.loadAllCourseLessons(courseId);

    // utilizziamo la combineLatest() function di RxJS al quale passiamo in un array gli observables che vogliamo combinare
    // questa funzione restituisce un observable con una tupla di TS, un array in cui l'elemento con index 0 sarà il primo observable passato nell'array, index 1 il secondo e così via
    this.data$ = combineLatest([course$, lessons$]).pipe(
      // il type restituito non è quello che vogliamo
      // tramite map operator prendiamo l'array e ne destrutturiamo il contenuto e ritorniamo un oggetto con questi 2 argomenti ottenuti tramite destrutturazione della tupla ottenuta con il combineLatest
      // in questo modo abbiamo un oggetto che rispetta l'interface CourseData
      map(([course, lessons]) => {
        return { course, lessons };
      }),
      tap(console.log)
    );
  }
}
