import { Request, Response } from "express";
import { COURSES } from "./db-data";
import { setTimeout } from "timers";

export function saveCourse(req: Request, res: Response) {
  // // creo un errore volontario nel salvataggio del corso
  // console.log("ERROR saving course!");
  // // res.sendStatus(500);
  // // se non passo il json con un message la proprietà error dell'oggetto di risposta sarà null
  // res.status(500).json({ message: "random error occurred." });
  // return;

  const id = req.params["id"],
    changes = req.body;

  console.log("Saving course changes", id, JSON.stringify(changes));

  const newCourse = {
    ...COURSES[id],
    ...changes,
  };

  COURSES[id] = newCourse;

  console.log("new course version", newCourse);

  setTimeout(() => {
    res.status(200).json(COURSES[id]);
  }, 2000);
}
