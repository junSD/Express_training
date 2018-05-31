var mongoose = require('mongoose');
var readline = require('readline');
var dbURI = 'mongodb://localhost/myapp';

mongoose.connect(dbURI);
//
// if (process.platform === 'win32') {
//     var rl = readline.createInterface({
//         input: process.stdin,
//         output: process.stdout
//     });
//     rl.on("SIGINT", function () {
//         process.emit ("SIGINT");
//     });
// }

mongoose.connection.on('connected', function () {
    console.log('Mongoose connected to ' + dbURI);
});

mongoose.connection.on('error', function (err) {
    console.log('Mongoose connection error ' + err);
});

mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected');
});

// require('./users');