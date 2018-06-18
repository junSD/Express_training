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
};
function createUser(userName, userAge) {
    $.ajax({
        url: "/users/",
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
                console.log(response.errorBody.name + ' - ' + response.message);
            } else {
                    var newUser = document.createElement('tr');
                    newUser.className = 'table__tr';
                    newUser.setAttribute('data-rowid', response.data._id);
                    newUser.innerHTML = createRow(response);
                    tbody.appendChild(newUser);
                    console.log(tbody);
                    reset();
            }
        }
    })
}
function createRow(response) {
    console.log('From row: ',response);
    var row;
    if (typeof response.data === 'object') {
        row = "<td>" + response.data.userName + "</td><td>" + response.data.userAge + "</td>"
            + "<td><button data-id='" + response.data._id + "' class='editUser'>Edit</button></td>" +
            "<td><button data-id='" + response.data._id + "' class='removeUser'>Delete</button></td>";
    }
    return row;
}
// reset forms
function reset() {
    var form = document.forms["userForm"];
    form.reset();
}

function deleteUser(id) {
    console.log(id);
    $.ajax({
        url: "/users/" + id,
        contentType: "application/json",
        method: "DELETE",
        success: function (response) {
            console.log(response);
            console.log(response.message);
            console.log(response.data);
            var id = response.data;
            var rowToDelete = $("tr[data-rowid='" + id + "']");
            console.log(rowToDelete);
            rowToDelete.remove();
        }
    })
}

function getUser(id) {
    $.ajax({
        url: "/users/" + id,
        contentType: "application/json",
        method: "GET",
        success: function (response) {
            console.log(response);
            var form = document.forms['userForm'];
            form.elements['id'].value = response.data[0]._id;
            form.elements['userName'].value = response.data[0].userName;
            form.elements['userAge'].value = response.data[0].userAge;
        }
    })
}

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
            var form = document.forms['userForm'];
            console.log(response);
            console.log(response.success);
            if (response.success) {
                console.log(form.elements["id"].value);
                form.elements["id"].value = 0;
                console.log(response);
                var changeUser = document.createElement('tr');
                changeUser.className = 'table__tr';
                changeUser.setAttribute('data-rowid', response.data._id);
                changeUser.innerHTML = createRow(response);
                $("tr[data-rowid='" +response.data._id + "']").replaceWith(changeUser);
                console.log('Edit ready');
            } else {
                console.log('Incorrect data was send to backend');
                form.elements["id"].value = 0;
            }
        }
    })
}

function getAllUsersToRefresh() {
    $.ajax({
        url: "/users/",
        contentType: "application/json",
        method: "GET",
        success: function (response) {
            console.log(response);
            // var table = document.getElementById("tableUser");
            // var tbody = table.tBodies[0];
            // console.log(tbody);
            // console.log('Length: ', response.user.length);
            // table.innerHTML = '';
            // for (var i = 0; i < response.user.length; i++) {
            //     console.log(response.user[i]);
            //     var userTr = document.createElement('tr');
            //     userTr.className = 'table__tr';
            //     userTr.setAttribute('data-rowid', response.user[i]._id);
            //     userTr.innerHTML = "<td>" + response.user[i].userName + "</td><td>" + response.user[i].userAge + "</td>"
            //         + "<td><button data-id='" + response.user[i]._id + "' class='editUser'>Edit</button></td>" +
            //         "<td><button data-id='" + response.user[i]._id + "' class='removeUser'>Delete</button></td>";;
            //     table.appendChild(userTr);
            //     console.log('response user: ', response.user);
            // }
            // console.log(tbody);
        }
    })
}

var tableUsers = document.querySelector("#tableUser");
console.log(tableUsers);
tableUsers.addEventListener('click', function (e) {
    e.preventDefault();
    var elem = e.target,
        id;
    if (elem.tagName.toLowerCase() === 'button') {
        if (elem.classList.contains('removeUser')) {
            console.log('Delete');
            id = elem.dataset.id;
            console.log(id);
            deleteUser(id);
        }
        if (elem.classList.contains('editUser')) {
            console.log('Edit');
            id = elem.dataset.id;
            console.log(id);
            getUser(id);
        }
    }
});

var buttonRefreshUser = document.querySelector("#refreshUsers");
buttonRefreshUser.addEventListener('click', function () {
    getAllUsersToRefresh();
});

function checkData(name, age) {
    var isCheck = false;
    var patternName = /[a-zA-Z]+/;
    var patternAge = /\d{1,2}/;
    if ((name !== '' && patternName.test(name)) && (age >= 0 && age < 100 && patternAge.test(age)) )  {
        isCheck = true;
    }
    return isCheck;
};

// document.addEventListener("DOMContentLoaded", getAllUsers);
function getAllUsers() {
    $.ajax({
        url: "/users/",
        contentType: "application/json",
        method: "GET",
        success: function (response) {
            console.log(response);
            var users = response.user;
            // console.log(users);
            // return users;
        },
        error: function(xhr, error){
            console.debug(xhr);
            console.debug(error);
        }
    })
}
