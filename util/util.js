'use strict';
var errors = require('common-errors');
var createError = require('http-errors');

module.exports.errorHandlerDB = function(err, req, res, next) {
    console.log('Error TOP: ' + err);
    if (!err) {
        if (next) {
            return next();
        }
        return res.end();
    }

// use common-errors mapping between error type and status code
    var httpStatusError = new errors.HttpStatusError(err, req);
    var messageMap = errors.HttpStatusError.message_map;
    var statusCode = httpStatusError.status_code;
    var errorCode = messageMap[statusCode] || messageMap[500];    // default to a 500 error
    console.log(messageMap);
    console.log('httpStatusError-------------------------------------', httpStatusError);
    var response = {
        object_type: "error",
        status_code: statusCode,
        error_code: errorCode,
        details: []
    };
    var message = {
        requestValue: err.value,
        path: err.path
    };
    function addMessage(obj){
        var key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (parseInt(key) === statusCode) {
                    console.log('key', key);
                    message[key] = obj[key];
                }
            }
        }
        response.details.push(message);
    }
    addMessage(messageMap);

    res.status(statusCode);
    res.json(response);
};

module.exports.createErrorCode404 = function (req, res, next) {
    next(createError(404));
};

module.exports.errorHandlerCode = function (err, req, res, next) {
    console.log(err);
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error', {
        err: err
    });
    next();
};