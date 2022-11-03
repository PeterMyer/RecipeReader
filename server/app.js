var createError = require('http-errors');
var express = require('express');
var cors = require('cors')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// const { expressjwt: expressJwt } = require('express-jwt');
// jwks = require('jwks-rsa');

require('dotenv').config();

var app = express();
app.use(cors())

//setting up jwt for Auth0 
// var jwtCheck = expressJwt({
//   secret: jwks.expressJwtSecret({
//       cache: true,
//       rateLimit: true,
//       jwksRequestsPerMinute: 5,
//       jwksUri: 'https://dev-y3c8dp4tuvq4d5da.us.auth0.com/.well-known/jwks.json'
// }),
// audience: 'https://byte-recide-reader.com',
// issuer: 'https://dev-y3c8dp4tuvq4d5da.us.auth0.com/',
// algorithms: ['RS256']
// });

// app.use(jwtCheck);

// app.get('/authorized', function (req, res) {
//   res.send('Secured Resource');
// });

//Allow cross site scripting for server
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json({limit: '50mb'}));

app.use(express.urlencoded({ limit: '50mb',extended: true }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.resolve(__dirname, '../client/build')));
app.use('/images', express.static('./server/images'))

app.use('/api', require('./api/index'));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
