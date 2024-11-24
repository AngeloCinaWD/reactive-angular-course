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

// il LoadingService registrato nei providers di AppComponent non è visibile qui, perchè questo componente non fa parte dello stesso branch del Component Tree
// se vogliamo gestire gli errori di questo componente dobbiamo registrare il MessagesService nei suoi providers, in modo da utilizzare una sua istanza del service
// come per lo spinner5 di caricamento vogliamo gestire gli errori all'interno della finestra di dialogo, il pannello con gli errori deve comparire nella finestra
// dobbiamo quindi registrare il service tra i providers ed inserire un MessagesComponent nel template di questo componente che farà riferimento a questa istanza del service
@Component({
  selector: "course-dialog",
  templateUrl: "./course-dialog.component.html",
  styleUrls: ["./course-dialog.component.css"],
  providers: [LoadingService, MessagesService],
})
export class CourseDialogComponent implements AfterViewInit {
  form: FormGroup;

  course: Course;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) course: Course,
    private coursesService: CoursesService,
    private loadingService: LoadingService,
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

    // const saveCourse$ = this.coursesService.saveCourse(this.course.id, changes);
    // per gestire gli errori utilizziamo il catchError() RxJS operator nell'observable che si ottiene chiamando il metodo saveCourse() del CoursesService
    const saveCourse$ = this.coursesService
      .saveCourse(this.course.id, changes)
      .pipe(
        catchError((err) => {
          // creo il messaggio che voglio visualizzare
          const message: string = "Could not save course.";
          console.log(message, err);
          // chiamo il metodo in MessagesService e gli passo la stringa con l'errore da mostrare
          this.messagesService.showErrors(message);
          return throwError(err);
        })
      );

    this.loadingService
      .showLoaderUntilCompleted(saveCourse$)
      .subscribe((val) => {
        this.dialogRef.close(val);
      });
  }

  close() {
    this.dialogRef.close();
  }
}
