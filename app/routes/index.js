var express = require('express');
var router = express.Router();
var requireAuth = require('../application/middleWare');
const session = require('express-session');


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

// Route to authenticate user
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  console.log(req.session);
  //TODO: Move this password to DB
  
  if (password === '123') {
    req.session.isAuthenticated = true;
    req.session.username = username;
    res.json({ message: 'Login successful' });
  } else {
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
