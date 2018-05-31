var mongoose = require('mongoose');

var usersSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    userAge: {
        type: Number
    }
});

var user = mongoose.model('User', usersSchema, 'users');

module.exports.User = user;
