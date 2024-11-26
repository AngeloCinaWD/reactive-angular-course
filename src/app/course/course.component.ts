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

// di default Angular controlla nei template di tutti i componenti se qualcosa è cambiato nelle template expressions (le parti non statiche, quelle date da javascript) per rirenderizzare un componente o no
// normalmente la change detection di default va benissimo per la maggior parte delle app, il problema si ha in quelle app molto grandi che hanno tantissime template expression e controllarle tutte richiede tempo per angular
// un modo alternativo di impostare la change detection è settarla su OnPush change detection, angular andrà a controllare solo se i dati che immettiamo sono cambiati o no ed andrà a renderizzare nuovamente solo quella parte
// un modo per iniettare nuovi dati sono ad esempio le @Input properties
// un altro modo per iniettare nuovi dati un componente, e che viene controllato con la OnPush change detection, si ha quando un OPbservable emette un nuovo valore
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

    const course$ = this.coursesService
      .loadCourseById(courseId)
      .pipe(startWith(null));

    const lessons$ = this.coursesService
      .loadAllCourseLessons(courseId)
      .pipe(startWith([]));

    this.data$ = combineLatest([course$, lessons$]).pipe(
      map(([course, lessons]) => {
        return { course, lessons };
      }),
      tap(console.log)
    );
  }
}
