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
  // immagazianiamo i risultati della ricerca direttamente qui, in un Obsevable di type Lesson[], cioè un array di lezioni
  // possiamo quindi immagazinare i dati direttamente nelle proprietà del componente padre per poterli utilizzare tranquillamente nei suoi child
  // ogni volta che il componente viene distrutto, ad esempio perchè cambio pagina, questi dati vengono persi
  searchResults$: Observable<Lesson[]>;

  // proprietà che si valorizza coi dati della lesson cliccata nel template
  activeLesson: Lesson;

  // iniettiamo il CoursesService
  constructor(private coursesService: CoursesService) {}

  ngOnInit() {}

  // riceve una stringa
  // per effettuare la chiamata al BE chiamiamo un metodo del CoursesService
  // con l'observable ottenuto con la chiamata http verso il BE valorizziamo l'observable searchResults$
  onSearch(value: string) {
    // aggiungo che setto a null activeLesson ad ogni click del search in modo da poter rieffettuare la ricerca e visualizzare i risultati anche metre sto guardando il detail di una lesson
    this.activeLesson = null;
    this.searchResults$ = this.coursesService.searchLessons(value);
  }

  // questo metodo va a valorizzare la proprietà activeLesson con la lesson passata come argomento
  openLesson(lesson: Lesson) {
    this.activeLesson = lesson;
  }

  // questo metodo deve far nascondere il detail della lesson e deve far ricomparire la tabella coi risultati
  onBackToSearch() {
    this.activeLesson = null;
  }
}
