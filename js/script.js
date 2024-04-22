let profilepic = document.getElementById("profile-pic");
let photoInput = document.getElementById("photoInput");
let firstName = document.getElementById('firstName');
let lastName = document.getElementById('lastName');
let dob = document.getElementById('dob');
let std = document.getElementById('std');
let parentFirstName = document.getElementById('parentFirstName');
let parentLastName = document.getElementById('parentLastName');
let address = document.getElementById('address');
let phoneNumber = document.getElementById('phoneNumber');
let cardstd = document.getElementById('cardstd');
let countButton = document.getElementById('countButton');
let count = 0;
let editcard = false;
let index;

const getdetails = () => {
    let getdet = JSON.parse(localStorage.getItem('studentdata'));
    if (getdet) {
        return getdet;
    } else {
        return [];
    }
}

let student = getdetails();

photoInput.onchange = function () {
    profilepic.src = URL.createObjectURL(photoInput.files[0]);
}

const submitForm = () => {
    event.preventDefault();
    if (!editcard) {
        const studetail = {
            firstName: firstName.value,
            lastName: lastName.value,
            dob: dob.value,
            std: std.value,
            parentFirstName: parentFirstName.value,
            parentLastName: parentLastName.value,
            address: address.value,
            phoneNumber: phoneNumber.value,
            photo: profilepic.src,
            id: student.length + 1,
        }
        student.push(studetail);
        localStorage.setItem('studentdata', JSON.stringify(student));
    } else {
        let cardUpdate = student.map((studentstd) => {
            if (studentstd.id == index) {
                return {
                    firstName: firstName.value,
                    lastName: lastName.value,
                    dob: dob.value,
                    std: std.value,
                    parentFirstName: parentFirstName.value,
                    parentLastName: parentLastName.value,
                    address: address.value,
                    phoneNumber: phoneNumber.value,
                    photo: profilepic.src,
                    id: index,
                }
            }
            return studentstd;
        });
        localStorage.setItem('studentdata', JSON.stringify(cardUpdate));
        student = getdetails();
    }
    firstName.value = "";
    lastName.value = "";
    dob.value = "";
    std.value = "";
    parentFirstName.value = "";
    parentLastName.value = "";
    address.value = "";
    phoneNumber.value = "";
    editcard = false;
    profilepic.src = "images/avatar-removebg-preview.png";
    viewcard();
    updateCount();
    showTable();
}

const viewcard = () => {
    if (student.length > 0) {
        cardstd.innerHTML = '';
        student.forEach(studentlist => {
            cardstd.innerHTML += `<div class="id-card d-flex">
   <div>
       <img src="${studentlist.photo}" alt="Student Image">
   </div>
   <div>
       <p class="info"><span class="label">Name:</span>  ${studentlist.firstName} ${studentlist.lastName}  </p>
       <p class="info"><span class="label">Date of Birth:</span>  ${studentlist.dob}  </p>
       <p class="info"><span class="label">Class:</span> ${studentlist.std}  </p>
       <p class="info"><span class="label">Parent's Name:</span>  ${studentlist.parentFirstName} ${studentlist.parentLastName}  </p>
       <p class="info"><span class="label">Address:</span>  ${studentlist.address} </p>
       <p class="info"><span class="label">Phone Number:</span>  ${studentlist.phoneNumber}  </p>
       <div class="buttons">
           <button onclick="selectStudent(${studentlist.id})">Select</button>
           <button onclick="deletedata(${studentlist.id})">Delete</button>
           <button onclick="editstudent(${studentlist.id})">Edit</button>
       </div>
   </div>
</div>`;
        });
    } else {
        cardstd.innerHTML = "Data Not Found !!!";
    }
}

const editstudent = (id) => {
    let edits = student.find((edit) => {
        return edit.id == id;
    })
    if (edits !== undefined) {
        firstName.value = edits.firstName;
        lastName.value = edits.lastName;
        dob.value = edits.dob;
        std.value = edits.std;
        parentFirstName.value = edits.parentFirstName;
        parentLastName.value = edits.parentLastName;
        address.value = edits.address;
        phoneNumber.value = edits.phoneNumber;
        profilepic.src = edits.photo;
    } else {
        cardstd.innerHTML = "Data Not Found !!!";
    }
    editcard = true;
    index = id;
}

const deletedata = (id) => {
    let deletestu = student.findIndex((deleteStudent) => {
        return deleteStudent.id == id;
    })
    if (deletestu != -1) {
        student.splice(deletestu, 1);
        localStorage.setItem('studentdata', JSON.stringify(student));
    } else {
        console.log("data is not found");
    }
    viewcard();
    showTable();
}

const selectStudent = (id) => {
    let selectedStudent = student.find(student => student.id === id);
    let selectedDataArray = JSON.parse(localStorage.getItem('selectedData')) || [];
    if (selectedStudent) {
        selectedDataArray.push(selectedStudent); // Corrected this line
        localStorage.setItem('selectedData', JSON.stringify(selectedDataArray));
        const table = document.getElementById('studentTableModal');
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Date of Birth</th>
                    <th>Class</th>
                    <th>Parent's Name</th>
                    <th>Address</th>
                    <th>Phone Number</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>${selectedStudent.firstName} ${selectedStudent.lastName}</td>
                    <td>${selectedStudent.dob}</td>
                    <td>${selectedStudent.std}</td>
                    <td>${selectedStudent.parentFirstName} ${selectedStudent.parentLastName}</td>
                    <td>${selectedStudent.address}</td>
                    <td>${selectedStudent.phoneNumber}</td>
                </tr>
            </tbody>
        `;
        const tableModal = new bootstrap.Modal(document.getElementById('tableModal'), {
            keyboard: false
        });
        // tableModal.show();
        count++;
        updateCount();
        // showTable();
    } else {
        console.log("Student not found!");
    }
}

const updateCount = () => {
    if (student.length === 0) {
        count = 0;
    } else {
        count = student.length;
    }
    countButton.textContent = `Count: ${count}`;
}

const showTable = () => {
    let selectedDataArray = JSON.parse(localStorage.getItem('selectedData')) || [];
    let table = document.getElementById('studentTableModal');
    table.innerHTML = '';
    if (selectedDataArray.length > 0) {
        let tableHeaders = `
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Date of Birth</th>
                    <th>Class</th>
                    <th>Parent's Name</th>
                    <th>Address</th>
                    <th>Phone Number</th>
                </tr>
            </thead>
        `;
        let tableRows = '';
        selectedDataArray.forEach(student => {
            tableRows += `
                <tr>
                    <td>${student.firstName} ${student.lastName}</td>
                    <td>${student.dob}</td>
                    <td>${student.std}</td>
                    <td>${student.parentFirstName} ${student.parentLastName}</td>
                    <td>${student.address}</td>
                    <td>${student.phoneNumber}</td>
                </tr>
            `;
        });
        table.innerHTML = tableHeaders + `<tbody>${tableRows}</tbody>`;
    } else {
        table.innerHTML = '<tr><td colspan="6">No data available</td></tr>';
    }
}

const openTableModal = () => {
    const tableModal = new bootstrap.Modal(document.getElementById('tableModal'), {
        keyboard: false
    });
    tableModal.show();
    showTable();
}

viewcard();
