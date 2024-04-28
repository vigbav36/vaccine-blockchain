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
const crypto = require('crypto');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var vaccineRouter = require('./routes/vaccine');

const sqlite3 = require('sqlite3').verbose();



const fs = require('fs');

const origins =  {
  origin: ["http://localhost:4200","http://localhost:4201"],
  default: "http://localhost:4200"
}
var app = express();

// view engine setup
app.set('host', '0.0.0.0');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('port', process.env.PORT || 3000);
// Add headers before the routes are defined
app.use(function (req, res, next) {
  const origin = origins.origin.includes(req.header('origin').toLowerCase()) ? req.headers.origin : origins.default;
  res.header("Access-Control-Allow-Origin", origin);
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/vaccine', vaccineRouter);

const dbFile = './database.db';
if (!fs.existsSync(dbFile)) {
    fs.closeSync(fs.openSync(dbFile, 'w'));
}
const generateSecret = (req, res, next) => {
  
  // const clientIP = req.ip || req.connection.remoteAddress;
  return crypto.randomBytes(32).toString('hex');
};
app.use(cookieParser());
app.use(session({
  secret: generateSecret(), 
  resave: false,
  saveUninitialized: true,
}));
app.use(bodyParser.json());

// Use cors middleware to accept requests from localhost:4200
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/vaccine', vaccineRouter);
const allowedOrigins = [
  "http://localhost:4200",
  "http://localhost:4201"
  // Replace with the IP address of your ESP32 device
  // Add more allowed origins if needed
];

// Use CORS middleware with allowed origins
app.use(cors({
  origin: function(origin, callback) {
    // Check if the request origin is in the allowed list
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow request
    } else {
      callback(new Error('Not allowed by CORS')); // Reject request
    }
  },
  methods: ['GET', 'POST'], // Allow these HTTP methods
  allowedHeaders: ['Content-Type'], // Allow these headers
  credentials: true // Allow credentials (cookies, etc.)
}));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
  next();
});


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

module.exports = app;
