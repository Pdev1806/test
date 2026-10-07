import { useEffect, useState } from "react";

function App() {

    const [students, setStudents] = useState([]);

    const [courses, setCourses] = useState([]);

    const [name, setName] = useState("");

    const [email, setEmail] = useState("");

    const [course, setCourse] = useState("");

    const [message, setMessage] = useState("");

    const [editingId, setEditingId] = useState(null);


    const getStudents = async () => {

        const response = await fetch(
            "http://localhost:5000/students"
        );

        const data = await response.json();

        setStudents(data);

    };


    const getCourses = async () => {

        const response = await fetch(
            "http://localhost:5000/courses"
        );

        const data = await response.json();

        setCourses(data);

    };


    useEffect(() => {

        getStudents();

        getCourses();

    }, []);


    const clearForm = () => {

        setName("");

        setEmail("");

        setCourse("");

        setEditingId(null);

    };


    const saveStudent = async (e) => {

        e.preventDefault();


        const student = {

            name: name,

            email: email,

            course: course

        };


        const response = await fetch(

            editingId
                ? `http://localhost:5000/students/${editingId}`
                : "http://localhost:5000/students",

            {

                method: editingId ? "PUT" : "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(student)

            }

        );


        const data = await response.json();

        setMessage(data.message);

        await getStudents();

        clearForm();

    };


    const editStudent = (student) => {

        setName(student.name);

        setEmail(student.email);

        setCourse(student.course);

        setEditingId(student._id);

    };


    const deleteStudent = async (id) => {

        const response = await fetch(

            `http://localhost:5000/students/${id}`,

            {
                method: "DELETE"
            }

        );


        const data = await response.json();

        setMessage(data.message);

        getStudents();

    };


    const registerCourse = async (id) => {

        const student = prompt(
            "Enter student name"
        );


        if (!student) {
            return;
        }


        const response = await fetch(

            `http://localhost:5000/courses/${id}/register`,

            {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    student: student
                })

            }

        );


        const data = await response.json();

        setMessage(data.message);

        getCourses();

    };


    const dropCourse = async (id) => {

        const student = prompt(
            "Enter student name"
        );


        if (!student) {
            return;
        }


        const response = await fetch(

            `http://localhost:5000/courses/${id}/drop`,

            {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    student: student
                })

            }

        );


        const data = await response.json();

        setMessage(data.message);

        getCourses();

    };


    return (

        <div>

            <h1>Student Teacher Management System</h1>


            {message && <p>{message}</p>}


            <h2>
                {editingId
                    ? "Edit Student"
                    : "Add Student"}
            </h2>


            <form onSubmit={saveStudent}>

                <input
                    type="text"
                    placeholder="Student Name"
                    value={name}
                    onChange={(e) =>
                        setName(e.target.value)
                    }
                />

                <br />
                <br />


                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                />

                <br />
                <br />


                <input
                    type="text"
                    placeholder="Course"
                    value={course}
                    onChange={(e) =>
                        setCourse(e.target.value)
                    }
                />

                <br />
                <br />


                <button type="submit">

                    {editingId
                        ? "Save Changes"
                        : "Add Student"}

                </button>


                {editingId && (

                    <button
                        type="button"
                        onClick={clearForm}
                    >
                        Cancel
                    </button>

                )}

            </form>


            <h2>Students</h2>


            <table border="1">

                <thead>

                    <tr>

                        <th>Name</th>

                        <th>Email</th>

                        <th>Course</th>

                        <th>Actions</th>

                    </tr>

                </thead>


                <tbody>

                    {students.map((student) => (

                        <tr key={student._id}>

                            <td>
                                {student.name}
                            </td>

                            <td>
                                {student.email}
                            </td>

                            <td>
                                {student.course}
                            </td>

                            <td>

                                <button
                                    onClick={() =>
                                        editStudent(student)
                                    }
                                >
                                    Edit
                                </button>


                                <button
                                    onClick={() =>
                                        deleteStudent(
                                            student._id
                                        )
                                    }
                                >
                                    Delete
                                </button>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>


            <h2>Courses</h2>


            <table border="1">

                <thead>

                    <tr>

                        <th>Course</th>

                        <th>Teacher</th>

                        <th>Available</th>

                        <th>Actions</th>

                    </tr>

                </thead>


                <tbody>

                    {courses.map((course) => (

                        <tr key={course._id}>

                            <td>
                                {course.name}
                            </td>

                            <td>
                                {course.teacher}
                            </td>

                            <td>
                                {course.available
                                    ? "Yes"
                                    : "No"}
                            </td>

                            <td>

                                <button
                                    onClick={() =>
                                        registerCourse(
                                            course._id
                                        )
                                    }
                                >
                                    Register
                                </button>


                                <button
                                    onClick={() =>
                                        dropCourse(
                                            course._id
                                        )
                                    }
                                >
                                    Drop
                                </button>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}

export default App;