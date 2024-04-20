const dotenv = require('dotenv');
dotenv.config({ path: '.env' });

var createError = require('http-errors');
var express = require('express');
const session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors package

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var vaccineRouter = require('./routes/vaccine');

<<<<<<< Updated upstream
const sqlite3 = require('sqlite3').verbose();



const fs = require('fs');


=======
>>>>>>> Stashed changes
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('port', process.env.PORT || 3000);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

<<<<<<< Updated upstream
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/vaccine', vaccineRouter);

const dbFile = './database.db';
if (!fs.existsSync(dbFile)) {
    fs.closeSync(fs.openSync(dbFile, 'w'));
}

=======
>>>>>>> Stashed changes
app.use(session({
  secret: 'FIJNWEIFWIEBISDNFIWEBFIWE', 
  resave: false,
  saveUninitialized: true
}));

app.use(bodyParser.json());

// Use cors middleware to accept requests from localhost:4200
app.use(cors())
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/vaccine', vaccineRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.setHeader('Referrer-Policy', 'no-referrer-when-downgrade');
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

<<<<<<< Updated upstream

const db = new sqlite3.Database(dbFile, (err) => {
  if (err) {
      console.error('Error connecting to database:', err.message);
  } else {
      console.log('Connected to the SQLite database.');
      createTables();
  }
});

function createTables() {
  db.run(`CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT,
          password TEXT
      )`, (err) => {
      if (err) {
          console.error('Error creating user table:', err.message);
      } else {
          console.log('User table created successfully.');
      }
  });
}
  
createTables()

=======
>>>>>>> Stashed changes
module.exports = app;
