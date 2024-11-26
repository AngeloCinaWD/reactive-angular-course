import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Course } from "../model/course";
import { map, shareReplay } from "rxjs/operators";
import { Lesson } from "../model/lesson";

@Injectable({
  providedIn: "root",
})
export class CoursesService {
  constructor(private http: HttpClient) {}

  loadAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>("/api/courses").pipe(
      map((valoreOriginale) => valoreOriginale["payload"]),
      shareReplay()
    );
  }

  saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
    return this.http
      .put(`/api/courses/${courseId}`, changes)
      .pipe(shareReplay());
  }

  searchLessons(value: string): Observable<Lesson[]> {
    return this.http
      .get<Lesson[]>("/api/lessons", {
        params: {
          filter: value,
          pageSize: "100",
        },
      })
      .pipe(
        map((response) => response["payload"]),
        shareReplay()
      );
  }

  // metodo per fetchare un corso dal BE secondo l'id
  loadCourseById(courseId: number): Observable<Course> {
    return this.http
      .get<Course>(`/api/courses/${courseId}`)
      .pipe(shareReplay());
  }
}
