console.log($);
$("form").submit(function (e) {
    e.preventDefault();
    var id = this.elements["id"].value;
    var name = this.elements["userName"].value;
    var age = this.elements["userAge"].value;
    console.log(id);
    if (id == 0){
        if (checkData(name, age)) {
            createUser(name, age);
        } else {
            sendError('Incorrect data');
        }
    } else {
        editUser(id, name, age);
    }


});
function sendError(message) {
    console.log(message);
}
function createUser(userName, userAge) {
    $.ajax({
        url: "/register",
        contentType: "application/json",
        method: "POST",
        data: JSON.stringify({
            userName: userName,
            userAge: userAge
        }),
        success: function (response) {
            console.log(response);
            console.log(response.message);
            var table = document.getElementById("tableUser");
            var tbody = table.tBodies[0];
            if (response.error) {
                console.log(response.body.name + ' - ' + response.message);
            } else {
                    var newUser = document.createElement('tr');
                    newUser.className = 'table__tr';
                    newUser.innerHTML = createRow(response);
                    tbody.appendChild(newUser);
                    console.log(tbody);
                    reset();
            }
        }
    })
}
function createRow(response) {
    var row = "<td>" + response.user[0].userName + "</td><td>" + response.user[0].userAge + "</td>"
        + "<td><button data-id='" + response.user[0]._id + "' class='editUser'>Edit</button></td>" +
        "<td><button data-id='" + response.user[0]._id + "' class='removeUser'>Delete</button></td>";
    return row;
}
// сброс формы
function reset() {
    var form = document.forms["userForm"];
    form.reset();
}
function checkData(name, age) {
    var isCheck = false;
    var patternName = /[a-zA-Z]+/;
    var patternAge = /\d{1,2}/;
    if ((name !== '' || patternName.test(name)) && (age >= 0 && age < 100 && patternAge.test(age)) )  {
        isCheck = true;
    }
    return isCheck;
}
function DeleteUser(id) {
    $.ajax({
        url: "/users/" + id,
        contentType: "application/json",
        method: "DELETE",
        success: function (response) {
            console.log(response);
            console.log(response.message);
            console.log(response.id);
            $("tr[data-rowid='" +response.id + "']").remove();
        }
    })
}
$('.removeUser').on('click', function () {
    console.log('Delete');
    var id = $(this).data('id');
    console.log(id);
    DeleteUser(id);
});
function getUser(id) {
    $.ajax({
        url: "/users/" + id,
        contentType: "application/json",
        method: "GET",
        success: function (response) {
            console.log(response);
            var form = document.forms['userForm'];
            form.elements['id'].value = response.user[0]._id;
            form.elements['userName'].value = response.user[0].userName;
            form.elements['userAge'].value = response.user[0].userAge;
        }
    })
}
$('.editUser').on('click', function () {
    console.log('Edit');
    var id = $(this).data('id');
    console.log(id);
    getUser(id);
});
function editUser(id, userName, userAge) {
    $.ajax({
        url: "/users/",
        contentType: "application/json",
        method: "PUT",
        data: JSON.stringify({
            id: id,
            userName: userName,
            userAge: userAge
        }),
        success: function (response) {
            reset();
            console.log(response);
            var changeUser = document.createElement('tr');
            changeUser.className = 'table__tr';
            changeUser.innerHTML = createRow(response);
            $("tr[data-rowid='" +response.user[0]._id + "']").replaceWith(changeUser);
        }
    })
}