var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var fileUpload = require('express-fileupload');



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var categoryRouter = require('./routes/categoryform.route');
var productRouter = require('./routes/productform.route');
var changepasswordRouter = require('./routes/changepassword.route');
var forgotpasswordRouter = require('./routes/forgotpassword.route');
var loginRouter=require('./routes/login.route');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: true, cookie: { maxAge: 6000000 } }));
app.use(fileUpload());


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/categoryform', categoryRouter);
app.use('/productform', productRouter);
app.use('/changepassword', changepasswordRouter);
app.use('/forgotpassword', forgotpasswordRouter);
app.use('/login',loginRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
