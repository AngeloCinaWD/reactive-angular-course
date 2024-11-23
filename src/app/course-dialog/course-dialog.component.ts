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

@Component({
  selector: "course-dialog",
  templateUrl: "./course-dialog.component.html",
  styleUrls: ["./course-dialog.component.css"],
  // inseriamo nei providers il LoadingService per poter avere una sua istanza
  providers: [LoadingService],
})
export class CourseDialogComponent implements AfterViewInit {
  form: FormGroup;

  course: Course;

  // anche in questo componente vogliamo utilizzare lo spinner di caricamento, quindi iniettiamo anche qui il LoadingService
  // questo componente non fa parte del Component Tree di cui fa parte HomeComponent, questo perchè viene istanziato quando clicchiamo il button Edit presente nel CourseCardListComponent e viene istanziato utilizzando l'Angular Material Dialogue Service iniettato nel constructor del CourseCardListComponent
  // quindi questo componente non è un figlio diretto del CourseCardListComponent, quindi esiste in un ramo differente dell'Angular Component Tree
  // il LoadingService, per come è impostato, non è accessibile a tutti i componenti, ma solo a quelli dove è indicato tra i providers ed i loro figli diretti, cioè quelli che vengono indicati all'interno dei loro template, anche tramite router-outlet
  // per utilizzare il LoadingService qui dobbiamo passarlo fra i providers del componente, questo farà si che verrà creata una nuova istanza del LoadingService, con i suoi valori delle proprietà in esso contenute, ogni volta che viene istanziato un nuovo componente CourseDialogComponent
  // per vedere lo spinner di caricamento dobbiamo inserire nel template di questo componente un LoadingComponent che sarà connesso al LoadingService che viene istanziato tramite questo provider
  // in questo modo si possono avere differenti spinner di caricamento, tutti indipendenti tra di loro
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) course: Course,
    private coursesService: CoursesService,
    private loadingService: LoadingService
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

    // this.coursesService.saveCourse(this.course.id, changes).subscribe((val) => {
    //   this.dialogRef.close(val);
    // });

    // per utilizzare il metodo salvo l'observable dato dal saveCourse

    const saveCourse$ = this.coursesService.saveCourse(this.course.id, changes);

    // lo passo al metodo showLoaderUntilCompleted() ed a questo faccio il subscribe
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
