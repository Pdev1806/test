const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());


mongoose.connect("mongodb://localhost:27017/collegeDB")
    .then(() => {
        console.log("MongoDB Connected");
    })
    .catch((error) => {
        console.log("MongoDB Error:", error);
    });


const studentSchema = new mongoose.Schema({

    name: String,

    email: String,

    course: String

});


const teacherSchema = new mongoose.Schema({

    name: String,

    subject: String,

    available: Boolean

});


const courseSchema = new mongoose.Schema({

    name: String,

    teacher: String,

    available: Boolean,

    students: [String]

});


const Student = mongoose.model(
    "Student",
    studentSchema
);

const Teacher = mongoose.model(
    "Teacher",
    teacherSchema
);

const Course = mongoose.model(
    "Course",
    courseSchema
);


app.get("/", (req, res) => {

    res.send("Student Teacher Management System");

});


/* STUDENTS */


/* Get all students */

app.get("/students", async (req, res) => {

    const students = await Student.find();

    res.json(students);

});


/* Add student */

app.post("/students", async (req, res) => {

    try {

        const student = new Student(req.body);

        await student.save();

        res.json({

            message: "Student added successfully",

            student: student

        });

    } catch (error) {

        res.status(400).json({

            message: "Unable to add student"

        });

    }

});


/* Update student */

app.put("/students/:id", async (req, res) => {

    try {

        const student = await Student.findByIdAndUpdate(

            req.params.id,

            req.body,

            {
                new: true
            }

        );


        if (!student) {

            return res.status(404).json({

                message: "Student not found"

            });

        }


        res.json({

            message: "Student updated successfully",

            student: student

        });

    } catch (error) {

        res.status(400).json({

            message: "Unable to update student"

        });

    }

});


/* Delete student */

app.delete("/students/:id", async (req, res) => {

    try {

        const student =
            await Student.findByIdAndDelete(
                req.params.id
            );


        if (!student) {

            return res.status(404).json({

                message: "Student not found"

            });

        }


        res.json({

            message: "Student deleted successfully"

        });

    } catch (error) {

        res.status(400).json({

            message: "Unable to delete student"

        });

    }

});


/* TEACHERS */


/* Get teachers */

app.get("/teachers", async (req, res) => {

    const teachers = await Teacher.find();

    res.json(teachers);

});


/* Add teacher */

app.post("/teachers", async (req, res) => {

    try {

        const teacher = new Teacher(req.body);

        await teacher.save();

        res.json({

            message: "Teacher added successfully",

            teacher: teacher

        });

    } catch (error) {

        res.status(400).json({

            message: "Unable to add teacher"

        });

    }

});


/* COURSES */


/* Get all courses */

app.get("/courses", async (req, res) => {

    const courses = await Course.find();

    res.json(courses);

});


/* Add course */

app.post("/courses", async (req, res) => {

    try {

        const course = new Course(req.body);

        await course.save();

        res.json({

            message: "Course added successfully",

            course: course

        });

    } catch (error) {

        res.status(400).json({

            message: "Unable to add course"

        });

    }

});


/* Student registers for course */

app.put("/courses/:id/register", async (req, res) => {

    try {

        const course = await Course.findByIdAndUpdate(

            req.params.id,

            {
                $push: {
                    students: req.body.student
                }
            },

            {
                new: true
            }

        );


        if (!course) {

            return res.status(404).json({

                message: "Course not found"

            });

        }


        res.json({

            message: "Student registered successfully",

            course: course

        });

    } catch (error) {

        res.status(400).json({

            message: "Unable to register student"

        });

    }

});


/* Student drops course */

app.put("/courses/:id/drop", async (req, res) => {

    try {

        const course = await Course.findByIdAndUpdate(

            req.params.id,

            {
                $pull: {
                    students: req.body.student
                }
            },

            {
                new: true
            }

        );


        if (!course) {

            return res.status(404).json({

                message: "Course not found"

            });

        }


        res.json({

            message: "Student removed from course",

            course: course

        });

    } catch (error) {

        res.status(400).json({

            message: "Unable to drop course"

        });

    }

});


/* Teacher manages course availability */

app.put("/courses/:id/availability", async (req, res) => {

    try {

        const course = await Course.findByIdAndUpdate(

            req.params.id,

            {
                available: req.body.available
            },

            {
                new: true
            }

        );


        if (!course) {

            return res.status(404).json({

                message: "Course not found"

            });

        }


        res.json({

            message: "Course availability updated",

            course: course

        });

    } catch (error) {

        res.status(400).json({

            message: "Unable to update availability"

        });

    }

});


app.listen(5000, () => {

    console.log(
        "Server running on http://localhost:5000"
    );

});