var express = require("express");
var path = require('path');
var app = express();
var bodyParser = require("body-parser");
require('./model/db.js');
var errorHandling = require('./util/util');
var _ = require('lodash');
var router = require('./routes/routes');

app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', router);

app.use(errorHandling.errorHandlerDB);

// catch 404 and forward to error handler
app.use(errorHandling.createErrorCode404,errorHandling.errorHandlerCode);


app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
