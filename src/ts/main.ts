"use strict"
const table = document.getElementById("course_table");

const form = document.getElementById("course_form");
const codeInput = <HTMLInputElement>document.getElementById("code");
const courseNameInput = <HTMLInputElement>document.getElementById("name");
const progressionInput = <HTMLInputElement>document.getElementById("progression");
const termInput = <HTMLInputElement>document.getElementById("term");
const syllabusInput = <HTMLInputElement>document.getElementById("syllabus");
const submit = <HTMLInputElement>document.getElementById("submit");

//Prevent default on form
form.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("Form Submitted");
})

//Get all courses on window load
window.addEventListener('load', getCourses);
//add course on click
submit.addEventListener("click", submitCourse);




//Function for getting all courses
function getCourses() {
    table.innerHTML = `<thead>
                        <tr>
                            <th>Course Code:</th>
                            <th>Course Name:</th>
                            <th>Progression:</th>
                            <th>Term</th>
                            <th>Syllabus</th>
                        </tr>`;

    fetch("https://localhost/moment5/api/api")
    .then(response => {
        if(response.ok) {
            return response.json();
        } else {
            throw new Error("Failed to fetch");
        }
    })
    .then(data => {
        if(!data.message) {
            data.forEach((course : {code: string, courseName: string, progression: string, term: number, syllabus: string}) => {
                table.innerHTML += 
                            `<tr>
                                <td class="bold">${course.code}</td>
                                <td>${course.courseName}</td>
                                <td>${course.progression}</td>
                                <td>${course.term}</td>
                                <td><a href="${course.syllabus}">Link</a></td>
                                <td id="${course.code}" onClick="deleteCourse(${course.code})">Delete</td>
                            </tr>`;
            })
        } else {
            console.log("API: " + data.message);
        }
    })
    .catch(err => console.log(err));
}


//function for deleting course
function deleteCourse(course : {id:string}) {
    fetch("https://localhost/moment5/api/api?code=" + course.id, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        getCourses();
    })
    .catch(error => {
        console.log("ERROR: ", error);
    })
}


//function for adding new course
function submitCourse() {
    let code = codeInput.value;
    let courseName = courseNameInput.value;
    let progression = progressionInput.value;
    let term = termInput.value;
    let syllabus = syllabusInput.value;

    let course = {'code': code, 'courseName': courseName, 'progression': progression, 'term': term, 'syllabus': syllabus};

    fetch("https://localhost/moment5/api/api", {
        method: 'POST',
        body: JSON.stringify(course),
    })
    .then(response => response.json())
    .then(data => {
        getCourses();
    })
    .catch(error => {
        console.log("ERROR: ", error);
    })



}