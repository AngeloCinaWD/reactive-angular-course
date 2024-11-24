import { Request, Response } from "express";
import { COURSES } from "./db-data";

export function getAllCourses(req: Request, res: Response) {
  // forzo un errore nel BE durante il caricamento dei corsi

  // console.log("ERROR loading courses!");
  // res.status(500).json({ message: "random error occurred." });
  // return;

  // qui posso incrementare il tempo di risposta del BE, in modo da poter vedere all'opera lo spinner di caricamento
  setTimeout(() => {
    // COURSES è un oggetto che contiene tante proprietà con values un oggetto
    // l'object.values restituisce un array contenente solo i values, quindi in questo caso il risultao è un array con tanti oggetti Course
    res.status(200).json({ payload: Object.values(COURSES) });
  }, 2000);
}

export function getCourseById(req: Request, res: Response) {
  const courseId = req.params["id"];

  const courses: any = Object.values(COURSES);

  const course = courses.find((course) => course.id == courseId);

  res.status(200).json(course);
}
