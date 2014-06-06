/**
 * Created by zikong on 14-5-20.
 */
var express = require('express');
var path = require('path');
var logger = require('morgan');
var http = require('http');
var bodyParser = require('body-parser');
var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 1337);
app.use(logger('dev'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser({uploadDir: './uploads', limit: '50mb'}));


routes(app);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});



http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
