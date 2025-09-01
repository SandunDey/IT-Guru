import exprees from 'express'
import { deleteStudent, getAllStudents, loginStudent, saveStudent, updateStudent } from '../controller/StudentController.js'; 

const StudentRoute = exprees.Router();
StudentRoute.post("/",saveStudent)
StudentRoute.get("/",getAllStudents)
StudentRoute.put("/:studentId",updateStudent)
StudentRoute.delete("/:studentId",deleteStudent)
StudentRoute.post("/loging",loginStudent)

export default StudentRoute;

