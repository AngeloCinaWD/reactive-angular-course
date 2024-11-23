import { Injectable } from "@angular/core";

// @Injectable({
//   providedIn: 'root'
// })
// questo service potrà avere diverse istanze, per diverse parti dell'app
@Injectable()
export class MessagesService {
  constructor() {}

  // implementiamo un metodo pubblico che riceve un array di stringhe
  showErrors(...errors: string[]) {}
}
