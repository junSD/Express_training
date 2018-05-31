var express = require("express");
var path = require('path');
var app = express();

var bodyParser = require("body-parser");
require('./model/db.js');
var router = require('./routes/routes');

app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', router);

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
