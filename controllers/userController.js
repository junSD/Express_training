'use strict';

var model = require('../model/users');
var util = require('util');

class SuccessResponse {
    constructor(messageStr, payload) {
        this.success = true;
        this.error = false;
        this.message = messageStr;
        this.data = payload;
    }
}
class ErrorResponse {
    constructor(messageStr, payload) {
        this.success = false;
        this.error = true;
        this.message = messageStr;
        this.errorBody = payload;
    }
}

class ErrorMessage extends Error {
    constructor (message) {
        super(message);
        this.messageError = message;
        this.name = "ErrorMessage";
    }
}
function CustomError(message, extra) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message;
    this.extra = extra;
}

util.inherits(CustomError, Error);

module.exports.getAllUsers = function (req, res, next) {
    model.User
        .find()
        .then(function(users) {
            res.render("index", {
               users: users
            });
        })
        .catch(function (err) {
            next(err);
        });
};

module.exports.addNewUser = function (req, res, next) {

    if (checkData(req.body.userName, req.body.userAge)) {
        var newUser = req.body;
        model.User
            .create(newUser)
            .then(function(user) {
                var resSuccess = new SuccessResponse('User was successfully added',user);
                return res.send(resSuccess);
            })
            .catch(function (err) {
                next(err);
            });
    } else {
        var resError = new ErrorResponse('Request is incorrect', req.body);
        return res.send(resError);
    }
};
module.exports.deleteUser = function (req, res,next) {
    var id = req.params.id;
    if (id) {
        console.log(id);
        model.User
            .find({_id: id})
            .deleteOne({_id: id})
            .then(function () {
                var resSuccess = new SuccessResponse('User was successfully deleted',id);
                return res.send(resSuccess);
            })
            .catch(function (err) {
                console.log(err);
                next(err);
            })
    } else {
        var resError = new ErrorResponse('ID is null', req.body);
        return res.send(resError);
    }

};
module.exports.getUserById = function (req, res, next) {
    var id = req.params.id;
    console.log(id);
    if (id) {
        model.User
            .find({_id: id})
            .then(function (user) {
                var resSuccess = new SuccessResponse('User was successfully got',user);
                return res.send(resSuccess);
            })
            .catch(function (err) {
                // var errorUserCl = new ErrorMessage('Something wrong');
                var customError = new CustomError('Custom Error', 55555);
                console.log('CustomError=============CustomError', customError);
                // console.log('ErrorUser: ------------=------------' , errorUserCl);
                // console.log('Message: ' , errorUserCl.message);
                // console.log('Value-----------: ' , errorUserCl.stringValue);
                // console.log('errorUserCl: ' , errorUserCl);
                console.log('Error-Native: ' , err);
                next(err);
            })
    } else {
        var resError = new ErrorResponse('ID is null', req.params.id);
        return res.send(resError);
    }
};

module.exports.getAllUsersRefresh = function (req, res, next) {
    model.User
        .find()
        .then(function (user) {
            var resSuccess = new SuccessResponse('User was successfully got',user);
            return res.send(resSuccess);
        })
        .catch(function (err) {
            next(err);
        })
};

module.exports.editUser = function (req, res, next) {
    if (checkData(req.body.userName, req.body.userAge)) {
        var query = {userName: req.body.userName, userAge: req.body.userAge};
        console.log(query);
        model.User
            .findByIdAndUpdate(req.body.id, query, {new: true})
            .then(function (user) {
                console.log(user);
                var resSuccess = new SuccessResponse('User was successfully got',user);
                return res.send(resSuccess);
            })
            .catch(function (err) {
                next(err);
            })
    } else {
        var resError = new ErrorResponse('Request is incorrect', req.body);
        return res.send(resError);
    }
};

module.exports.checkUsers = function (req, res, next) {
    var flag = false;
    if (users.length){
        for (var i = 0; i < users.length; i++) {
            console.log(users[i].userName);
            if (users[i].userName === req.body.userName) {
                flag = true;
            }
        }
    }

    if (flag || req.body.userName === '') {
        return res.send({success: false, error: true, message: 'User already exist'});
    } else {
        next();
    }
};

module.exports.checkLogged = function (req, res, next) {
    console.log('LOGGED');
    next();
};

//auxiliary function

function checkData(name, age) {
    var isCheck = false;
    var patternName = /[a-zA-Z]+/;
    var patternAge = /\d{1,2}/;
    console.log(name !== '',patternName.test(name), age >= 0, age < 100, patternAge.test(age));
    if ((name !== '' && patternName.test(name)) && (age >= 0 && age < 100 && patternAge.test(age)) )  {
        isCheck = true;
    }
    return isCheck;
}



