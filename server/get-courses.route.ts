import { Request, Response } from "express";
import { COURSES } from "./db-data";

export function getAllCourses(req: Request, res: Response) {
  /*
    console.log("ERROR loading courses!");
    res.status(500).json({message: 'random error occurred.'});
    return;
 */

  setTimeout(() => {
    // COURSES è un oggetto che contiene tante proprietà con values un oggetto
    // l'object.values restituisce un array contenente solo i values, quindi in questo caso il risultao è un array con tanti oggetti Course
    res.status(200).json({ payload: Object.values(COURSES) });
  }, 200);
}

export function getCourseById(req: Request, res: Response) {
  const courseId = req.params["id"];

  const courses: any = Object.values(COURSES);

  const course = courses.find((course) => course.id == courseId);

  res.status(200).json(course);
}
