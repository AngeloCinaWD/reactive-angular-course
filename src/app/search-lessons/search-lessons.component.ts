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
} from "rxjs/operators";
import { merge, fromEvent, Observable, concat } from "rxjs";
import { Lesson } from "../model/lesson";
import { CoursesService } from "../services/courses.service";

// MASTER DETAIL USER INTERFACE PATTERN
// unesempio di questo pattern si ha quando ad esempio facciamo una ricerca, abbiamo una serie di risultati (master table) e una vista dei dettagli per ogni risultato

@Component({
  selector: "course",
  templateUrl: "./search-lessons.component.html",
  styleUrls: ["./search-lessons.component.css"],
})
export class SearchLessonsComponent implements OnInit {
  searchResults$: Observable<Lesson[]>;

  activeLesson: Lesson;

  constructor(private coursesService: CoursesService) {}

  ngOnInit() {}

  onSearch(value: string) {
    this.activeLesson = null;
    this.searchResults$ = this.coursesService.searchLessons(value);
  }

  openLesson(lesson: Lesson) {
    this.activeLesson = lesson;
  }

  onBackToSearch() {
    this.activeLesson = null;
  }
}
