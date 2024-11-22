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

@Component({
  selector: "course-dialog",
  templateUrl: "./course-dialog.component.html",
  styleUrls: ["./course-dialog.component.css"],
})
export class CourseDialogComponent implements AfterViewInit {
  form: FormGroup;

  course: Course;

  constructor(
    private fb: FormBuilder,
    // dichiaro una proprietà dialogRef che rappresenta la finestra di dialogo e che tipo di componente è
    // la valorizzo al momento dell'istanziamento del nuovo componente tramite MatDialogRef
    private dialogRef: MatDialogRef<CourseDialogComponent>,
    // QUESTO è IMPORTANTE: INIETTO I DATI PASSATI TRAMITE CONFIG E LI ATTRIBUISCO ad un argument del costruttore course
    @Inject(MAT_DIALOG_DATA) course: Course,
    // per modficare un Course ho bisogno del CoursesService in cui creo un metodo che effettuerà una chiamata ed invierà i dati con le modifiche
    private coursesService: CoursesService
  ) {
    // quando si instanzia il componente valorizzo la proprietà course coi dati iniettati nel costruttore
    this.course = course;

    // setto il form, gli passo i dati del course che saranno mostrati quando apro la finestra di dialogo
    this.form = fb.group({
      description: [course.description, Validators.required],
      category: [course.category, Validators.required],
      releasedAt: [moment(), Validators.required],
      longDescription: [course.longDescription, Validators.required],
    });
  }

  ngAfterViewInit() {}

  // quando clicco save nella finestra i dati del form vengono salvati in una const changes
  // i dati del form non contengono tutte le proprietà che ha un oggetto Course, solo alcune, infatti nel metodo saveCourse() il type di changes è un Partial di Course e non un Course
  save() {
    const changes = this.form.value;

    // mi sottoscrivo al metodo per far funzionare l'observable
    // quando ha finito voglio che si chiuda la finestra, gli passo il value emesso dall'observable,
    this.coursesService.saveCourse(this.course.id, changes).subscribe((val) => {
      // questo metodo .close() è quello di material, non quello che ho creato io in questa, il valore che passo qui è quello che riceve il metodo di material afterClosed() che genera un observable che emetterà questo valore
      // il valore emesso dall'observable è la response dal BE, l'oggetto Course modificato
      this.dialogRef.close(val);
    });
  }

  close() {
    // posso chiudere la finestra di dialogo grazie alla proprietà dichiarata nel costruttore
    this.dialogRef.close();
  }
}
