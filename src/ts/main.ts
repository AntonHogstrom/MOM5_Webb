"use strict"

//variables for table elements
const table = document.getElementById("course_table");
const buttonDiv = document.getElementById("buttonDiv");
const getAll = document.getElementById("getAll");
const getOne_input = <HTMLInputElement>document.getElementById("getOne_input");
const getOne_button = document.getElementById("getOne_button");


//variables for add course form
const form = document.getElementById("course_form");
const codeInput = <HTMLInputElement>document.getElementById("code");
const courseNameInput = <HTMLInputElement>document.getElementById("name");
const progressionInput = <HTMLInputElement>document.getElementById("progression");
const termInput = <HTMLInputElement>document.getElementById("term");
const syllabusInput = <HTMLInputElement>document.getElementById("syllabus");
const submit = <HTMLInputElement>document.getElementById("submit");


let api : string;

if(window.location.hostname == "localhost") {
    api = "https://localhost/mom5_api/api";
} else {
    api = "https://devnoe.com/MIUN/WEBB3MOM5/API/api";
}

//Prevent default on form
form.addEventListener("submit", (e) => {
    e.preventDefault();
})


//Get all courses on window load
window.addEventListener('load', getCourses);
//add course on click
submit.addEventListener("click", submitCourse);
//get all courses on click
getAll.addEventListener("click", getCourses);
//get one course on click
getOne_button.addEventListener("click", () => {
    getCourse(getOne_input.value);
})


// Removes the update course form
function removeUpdateForm() {
    if(document.getElementById("update_form")) {
        const updateForm = document.getElementById("update_form");
            updateForm.innerHTML = "";
    }
}


//Function for getting all courses
function getCourses() {

    removeUpdateForm();

    table.innerHTML = `<thead>
                        <tr>
                            <th>Course Code:</th>
                            <th>Course Name:</th>
                            <th>Progression:</th>
                            <th>Term</th>
                            <th>Syllabus</th>
                        </tr>`;

    fetch(api)
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
                                <td class="edit" id="${course.code}_edit" onClick="updateInputs(${course.code})">Edit</td>
                                <td class="delete" id="${course.code}" onClick="deleteCourse(${course.code})">Delete</td>
                            </tr>`;
            })
        } else {
            console.log("API: " + data.message);
        }
    })
    .catch(err => console.log(err));
}


//Function for getting ONE course by course code
function getCourse(code : string) {

    removeUpdateForm();

    table.innerHTML = `<thead>
                        <tr>
                            <th>Course Code:</th>
                            <th>Course Name:</th>
                            <th>Progression:</th>
                            <th>Term</th>
                            <th>Syllabus</th>
                        </tr>`;

    fetch(api + "?code=" + code)
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
                                <td class="edit" id="${course.code}_edit" onClick="updateInputs(${course.code})">Edit</td>
                                <td class="delete" id="${course.code}" onClick="deleteCourse(${course.code})">Delete</td>
                            </tr>
                            `;
            })
        } else {
            console.log("API: " + data.message);
        }
    })
    .catch(err => console.log(err));
}



// Function which is put on edit buttons on click. Creates form inputs to update course
function updateInputs(code : HTMLInputElement) {
    
    removeUpdateForm();

    getCourse(code.id);


    table.insertAdjacentHTML("afterend", `
                
    <form id="update_form" method="POST">

    <div class="updateDiv">
        <h2>Update Course: <span id="code_update">${code.id}</span></h2>
    </div>

    <div class="updateDiv">
        <label for="name_update">Course Name:</label>
        <input id="name_update" name="name_update" type="text" placeholder="ex. Webbutveckling 1">
    </div>

    <div class="updateDiv">
        <label for="progression_update">Progression:</label>
        <input id="progression_update" name="progression_update" type="text" placeholder="ex. A">
    </div>

    <div class="updateDiv">
        <label for="term_update">Term:</label>
        <input id="term_update" name="term_update" type="number" placeholder="ex. 1">
    </div>

    <div class="updateDiv">
        <label for="syllabus_update">Syllabus:</label>
        <input id="syllabus_update" name="syllabus_update" type="text" placeholder="https://website.com">
    </div>

    <div class="updateDiv">
        <input id="update" type="submit" value="Update">
    </div>

</form>
`);

//variables for update course form
const update_form = document.getElementById("update_form");
const update_code = <HTMLInputElement>document.getElementById("code_update");
const update_name = <HTMLInputElement>document.getElementById("name_update");
const update_progression = <HTMLInputElement>document.getElementById("progression_update");
const update_term = <HTMLInputElement>document.getElementById("term_update");
const update_syllabus = <HTMLInputElement>document.getElementById("syllabus_update");
const update = <HTMLInputElement>document.getElementById("update");


    //Update Course function
    function updateCourse(course : string) {

        let code = update_code.innerHTML;
        let courseName = update_name.value
        let progression = update_progression.value;
        let term = update_term.value;
        let syllabus = update_syllabus.value;
    
        let update_course = {'code': code, 'courseName': courseName, 'progression': progression, 'term': term, 'syllabus': syllabus};
    
        fetch(api + "?code=" + course, {
            method: 'PUT',
            body: JSON.stringify(update_course),
        })
        .then(response => response.json())
        .then(data => {
            getCourses();
        })
        .catch(error => {
            console.log("ERROR: ", error);
        })
    }

    update_form.addEventListener("submit", (e) => {
        e.preventDefault();
        updateCourse(code.id);
    })




}

//function for deleting course
function deleteCourse(course : {id:string}) {
    fetch(api + "?code=" + course.id, {
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
    
    fetch(api, {
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


