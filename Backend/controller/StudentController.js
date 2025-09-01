import Student from "../model/Student.js";
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
dotenv.config();


export async function saveStudent(req, res) {

    try {
        const { studentId, name, address, year, nic, birthday, gender, email, password, confirmPassword, phonenumber } = req.body;
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);
        

        
        if (req.body.password !== req.body.confirmPassword) {
            return res.status(400).json({ message: "Password and Confirm Password do not match" });
        }else{
            
        

        const student = new Student({
            studentId,
            name,
            address,
            year,
            nic,
            birthday,
            gender,
            email,
            password:hashedPassword, 
            phonenumber
        });

       
        await student.save();

        res.status(201).json({
            message: "Student saved successfully",
            student
        });
    }

    } catch (err) {
        res.status(500).json({
            message: "Error saving student",
            error: err.message
        });
    }
}


export function getAllStudents(req,res){
    Student.find().then(
        (Student)=>{
            res.json(Student)
        }
    ).catch(
        (error)=>{
            res.status(500).json({
                message:"Error search Student",
            });
        }
    );
}

export function updateStudent(req,res){
    Student.findOneAndUpdate({ 
        studentId:req.params.studentId
    },req.body).then(
        (Student)=>{
            if(Student==null){
                res.status (404).json({
                    message:"Student not Found"
                });
            }else{
                res.json({
                    message:"Student Update Successfully"
                });
            }
        }

    ).catch(
        (error)=>{
            res.status(500).json({
                message:"Error Updating Student"
            })
        }
    )
}

export function deleteStudent(req,res){
    if(req.student == null){
        res.status(403).json({
            message:"You need logging first to delete student"
        })
        return;
    }
    if(req.Student.role!="admin"){
        res.status(403).json({
            message:"You are not allowed to delete Student"
        })
        return;
    }


    Student.findOneAndDelete({
        studentId : req.params.studentId
         
    }).then(
        (Student)=>{
            if(Student==null){
                res.status(404).json({
                    message:"Student not found"
                });
            }else{
                res.json({
                    message:"Student delete Successfully",
                })
            }
        }
    )
}

export function loginStudent(req, res) {
    const  email = req.body.email;
    const password = req.body.password;

    Student.findOne({
        email : email
    }).then((student) => {
        if(student == null){
            res.json({
                message: "Student not found"
            })
        }else{
            const isPasswordCorrect = bcrypt.compareSync(password, student.password);
            if(isPasswordCorrect){
               
                const studentData = {
                    studentId:student.studentId,
                    name:student.name,
                    address:student.address,
                    year:student.year,
                    nic:student.name,
                    birthday:student.birthday,
                    gender:student.gender,
                    email : student.email,
                    password:student.password,
                    phonenumber:student.phonenumber,

                 
                };
              const token = jwt.sign(studentData,process.env.JWT_KEY)
                res.json({
                    message: "Login successful",
                    token: token,
                    student: studentData
                });  
        }else{
            res.json({
                message: "Incorrect password"
            });
            
        }
    }
})
}