import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Course } from "../model/course";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { CourseDialogComponent } from "../course-dialog/course-dialog.component";
import { filter, tap } from "rxjs/operators";

@Component({
  selector: "courses-card-list",
  templateUrl: "./courses-card-list.component.html",
  styleUrl: "./courses-card-list.component.scss",
})
export class CoursesCardListComponent {
  @Input()
  courses: Course[] = [];

  // evento custom da emettere quando edito il Course
  @Output()
  private coursesChanged = new EventEmitter();

  constructor(private dialog: MatDialog) {}

  // tramite angular material apro una finestra di dialogo
  // il metodo riceve il l'istanza del Course
  editCourse(course: Course) {
    // creo un set di configurazioni per la finestra di dialogo
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "400px";

    // i dati che passo alla finestra di dialogo li metto nelle configurazioni, proprietà data
    // gli passo il Course
    dialogConfig.data = course;

    // apro la finestra e la salvo in un variabile
    // indico il componente da utilizzare e le configurazioni per la finestra
    const dialogRef = this.dialog.open(CourseDialogComponent, dialogConfig);

    // la const dialogRef creata con l'apertura della finestra, contiene diversi observable
    // ad esempio afterClosed(), questo se chiudo la finestra e basta avrà value undefined
    // passando invece un valore al metodo dialogRef.close(value) avrà questo value
    // quello che voglio fare è che in caso di chiusura della finestra e di successo il componente courses-card-list emetta l'evento custom coursesChanged
    // utilizzo il filter rxjs operator che mi restituisce il val solo se esiste, cioè se è stato passato al close()
    // voglio che al momento della risposta e di chiusura della finestra di dialogo venga rinnovata la sottoscrione ai courses perchè, essendo un'app stateless, devo ricevere nuovamente i nuovi corsi, come se ricaricassi la pagina
    // quindi triggero l'evento custom creato CoursesChanged che emette il corso modificato
    // in HomeComponent.html ascolto l'evento e mi sottoscrivo nuovamente all'observable dato da loadAllCourses, chiamando un metodo che lo faccia in HomeComponent.ts
    // lo faccio utilizzando il tap operator rxjs, che mi permette di fare qualcosa in contemporanea al filter
    dialogRef
      .afterClosed()
      .pipe(
        filter((val) => !!val),
        // non ho bisogno di passare il corso modificato perchè i dati proveranno dal BE dove è presente il corso modificato
        tap(() => this.coursesChanged.emit())
      )
      // praticamente nel subscribe non faccio niente
      .subscribe((val) => console.log(val));
  }
}
