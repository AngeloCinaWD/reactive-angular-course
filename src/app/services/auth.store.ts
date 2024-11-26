import { Injectable } from "@angular/core";
import { User } from "../model/user";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, map, shareReplay, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { json } from "body-parser";
import { MessagesService } from "./messages.service";

const AUTH_DATA: string = "auth_data";

@Injectable({
  providedIn: "root",
})
export class AuthStore {
  private subject = new BehaviorSubject<User>(null);

  user$: Observable<User> = this.subject.asObservable();

  isLoggedIn$: Observable<boolean>;

  isLoggedOut$: Observable<boolean>;

  constructor(
    private http: HttpClient,
    private messagesService: MessagesService
  ) {
    this.isLoggedIn$ = this.user$.pipe(map((user) => !!user));

    this.isLoggedOut$ = this.isLoggedIn$.pipe(map((loggedIn) => !loggedIn));

    const user = localStorage.getItem(AUTH_DATA);

    if (user) {
      this.subject.next(JSON.parse(user));
    }
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<User>("/api/login", { email, password }).pipe(
      tap((user) => {
        this.subject.next(user);
        localStorage.setItem(AUTH_DATA, JSON.stringify(user));
      }),
      // voglio gestire l'errore qui, blocco qui e mostro il pannello con l'errore
      catchError((err) => {
        const message = "Login non riuscito";
        this.messagesService.showErrors(message);
        return throwError(err);
      }),
      shareReplay()
    );
  }

  logout() {
    this.subject.next(null);
    localStorage.removeItem(AUTH_DATA);
  }
}
