import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Course } from "../model/course";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import moment from "moment";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { CoursesService } from "../services/courses.service";
import { LoadingService } from "../services/loading.service";
import { MessagesService } from "../services/messages.service";
import { CoursesStore } from "../services/courses.store";

@Component({
  selector: "course-dialog",
  templateUrl: "./course-dialog.component.html",
  styleUrls: ["./course-dialog.component.css"],
  // al momento abbiamo quindi 2 istanze per ognuno di questi service, una disponibile in tutta la root dell'app ed una per il course-dialog-component, questo porta ad una inconsistenza nei dati, infatti se ora modificassi un corso tornando alla home non lo vedrei aggiornato, dovrei ricaricare la pagina
  // adattiamo il CourseDialogComponent in modo da utilizzare lo store dei dati anche per le modifiche, modificando i dati in memoria e non attendendo il salvataggio nel BE, Optimistic Way
  // non abbiamo bisogno del CoursesService ma del CoursesStore che iniettiamo nel constructor
  // non abbiamo bisogno del LoadingService perchè non si attende una risposta dal BE
  // providers: [LoadingService, MessagesService],
  providers: [MessagesService],
})
export class CourseDialogComponent implements AfterViewInit {
  form: FormGroup;

  course: Course;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) course: Course,
    private coursesStore: CoursesStore,
    // private coursesService: CoursesService,
    // private loadingService: LoadingService,
    private messagesService: MessagesService
  ) {
    this.course = course;

    this.form = fb.group({
      description: [course.description, Validators.required],
      category: [course.category, Validators.required],
      releasedAt: [moment(), Validators.required],
      longDescription: [course.longDescription, Validators.required],
    });
  }

  ngAfterViewInit() {}

  save() {
    const changes = this.form.value;

    // const saveCourse$ = this.coursesService
    //   .saveCourse(this.course.id, changes)
    //   .pipe(
    //     catchError((err) => {
    //       const message: string = "Could not save course.";
    //       this.messagesService.showErrors(message);
    //       return throwError(err);
    //     })
    //   );

    // chiamiamo il metodo saveCourse dello store, non salvo l'observable in una const, non mi serve perchè i dati sono nello store globale
    // devo fare il subscribe in modo far funzionare il tutto
    // non serve a nulla gestire l'errore qui perchè chiudo la finestra immediatamente e l'errore non verrebbe mostrato
    this.coursesStore
      .saveCourse(this.course.id, changes)
      // .pipe(
      //   catchError((err) => {
      //     const message: string = "Could not save course.";
      //     this.messagesService.showErrors(message);
      //     return throwError(err);
      //   })
      // )
      .subscribe();

    // a questo punto chiudo la finestra di dialogo e passo un value qualsiasi al close(value) in modo da distinguerlo dal caso in cui chiudo la finestra di dialogo senza aver fatto operazioni di modifica

    this.dialogRef.close(changes);

    // non ho bisogno dello spinner di caricamento

    // this.loadingService
    //   .showLoaderUntilCompleted(saveCourse$)
    //   .subscribe((val) => {
    //     this.dialogRef.close(val);
    //   });
  }

  close() {
    this.dialogRef.close();
  }
}
