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
import { merge, fromEvent, Observable, concat, throwError } from "rxjs";
import { Lesson } from "../model/lesson";
import { CoursesService } from "../services/courses.service";

@Component({
  selector: "course",
  templateUrl: "./course.component.html",
  styleUrls: ["./course.component.css"],
})
export class CourseComponent implements OnInit {
  // per prima cosa trasformiamo queste 2 proprietà statiche in 2 Observable
  // Observable type Course
  // course: Course;
  course$: Observable<Course>;

  // Observable type Lesson[]
  // lessons: Lesson[];
  lessons$: Observable<Lesson[]>;

  // iniettiamo il CoursesService per chiamare il BE
  constructor(
    private route: ActivatedRoute,
    private coursesService: CoursesService
  ) {}

  ngOnInit() {
    // quando si instanzia il componente andiamo a fetchare il Course dal BE
    // a questo componente ci si arriva tramite una rotta, quindi utilizziamo l'ActivatedRoute per ottenere l'id del corso da fetchare
    // utilizziamo il parseInt per convertire il valore da stringa ad integer
    const courseId = parseInt(this.route.snapshot.paramMap.get("courseId"));

    // una volta ottenuto l'id chiamiamo il metodo loadCourseById del CoursesService passandoglielo come argomento
    // con il return del metodo andiamo a valorizzare l'observable Course$
    this.course$ = this.coursesService.loadCourseById(courseId);

    // dobbiamo fetchare le lessons relative al corso e valorizzare l'observable lessons$ in modo da poterlo sottoscrivere nel template
    this.lessons$ = this.coursesService.loadAllCourseLessons(courseId);
  }
}
