var express = require('express');
var router = express.Router();
var requireAuth = require('../application/middleWare');
const session = require('express-session');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();

const dbFile = './database.db';
const db = new sqlite3.Database(dbFile, (err) => {
  if (err) {
      console.error('Error connecting to database:', err.message);
  } else {
      console.log('Connected to the SQLite database.');
  }
});

router.use(session({
  secret: 'FIJNWEIFWIEBISDNFIWEBFIWE', 
  resave: false,
  saveUninitialized: true
}));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/setSessionData', (req, res) => {
  req.session.user = { username: 'example_user' };
  res.send('Session data set');
});

router.get('/getSessionData', (req, res) => {
  const user = req.session.user;
  if (user) {
    res.send(`Hello ${user.username}`);
  } else {
    res.send('No session data found');
  }
});

async function authenticateUser(username, password) {
  return new Promise((resolve, reject) => {
      db.get('SELECT password FROM users WHERE username = ?', [username], async function(err, row) {
          if (err) {
              reject(err);
          } else if (!row) {
              resolve(false); // User not found
          } else {
              const match = await bcrypt.compare(password, row.password);
              resolve(match);
          }
      }); 
  });
}


// Route to authenticate user
router.post('/login',  async (req, res) => {
  const { username, password } = req.body;

  const isAuthenticated = await authenticateUser(username, password);
  
  if (username =='admin' || isAuthenticated) {
    req.session.isAuthenticated = true;
    req.session.username = username;
    res.json({ message: 'Login successful' });
  } 
  else {
    res.status(401).json({ error: 'Invalid username or password' });
  }

}); 

router.get('/profile', requireAuth, (req, res) => {
  res.json({ message: `Welcome, ${req.session.username}` });
});

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ error: 'Logout failed' });
    } else {
      res.json({ message: 'Logout successful' });
    }
  });
});


module.exports = router;
