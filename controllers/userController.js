'use strict';

var model = require('../model/users');

module.exports.getAllUsers = function (req, res) {
    model.User
        .find()
        .then(function(users) {
            res.render("index", {
               users: users
            });
        })
        .catch(function (err) {
            return res.send({success: false, error: true, message: 'User already exist', body: err});
        });

};
module.exports.addNewUser = function (req, res) {
    var newUser = req.body;
    model.User
        .create(newUser)
        .then(function(user) {
            return res.send({success: true, error: false, message: 'User was successfully added', user: user});
        })
        .catch(function (err) {
            return res.send({success: false, error: true, message: 'User already exist', body: err});
        });
};
module.exports.deleteUser = function (req, res) {
    var id = req.params.id;
    console.log(id);
    model.User
        .find({_id: id})
        .deleteOne({_id: id}, function (err) {
            if (err) return hsndleError(err);
        })
        .then(function (user) {
            return res.send({success: true, error: false, message: 'User was successfully deleted', user: user, id: id});
        })
        .catch(function (err) {
            return res.send({success: false, error: true, message: 'User already deleted', body: err});
        })
};
module.exports.getUserById = function (req, res) {
    var id = req.params.id;
    console.log(id);
    model.User
        .find({_id: id})
        .then(function (user) {
            return res.send({success: true, error: false, message: 'User was successfully got', user: user, id: id});
        })
        .catch(function (err) {
            return res.send({success: false, error: true, message: 'Something wrong', body: err});
        })
};

module.exports.getAllUsersRefresh = function (req, res) {
    // var users = req.body;
    // console.log(users);
    model.User
        .find()
        .then(function (user) {
            return res.send({success: true, error: false, message: 'User was successfully got', user: user});
        })
        .catch(function (err) {
            return res.send({success: false, error: true, message: 'Something wrong', body: err});
        })
};

module.exports.editUser = function (req, res) {
    var changeUser = req.body;
    console.log(changeUser);
    console.log(req.body);
    var query = {userName: req.body.userName, userAge: req.body.userAge};
    model.User
        // .find({_id: req.body.id})
        .findByIdAndUpdate(req.body.id, query, {new: true})
        .then(function (user) {
            console.log(user);
            return res.send({success: true, error: false, message: 'User was successfully got', user: user, changeUser: changeUser});
        })
        .catch(function (err) {
            return res.send({success: false, error: true, message: 'Something wrong', body: err});
        })
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
        // return users.push(req.body);
    }
    // next();
};

module.exports.checkLogged = function (req, res, next) {
    console.log('LOGGED');
    next();
};

