var express = require('express');
var router = express.Router();
const {getVaccinesByBrand , registerViolations, getVaccineHistory, addVaccine, getVaccine, transferOwner, registerUser, requestTransfer, getAllVaccines, getAllVaccinesContainer}= require("../application/vaccine.js")
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


router.get('/:vaccine_id', requireAuth, async function(req, res, next) {
    const result = await getVaccine(req.params.vaccine_id);
    res.json(result);
});

router.get('/brand/:brand', requireAuth, async function(req, res, next) {
    const brand = req.params.brand;
    const result = await getVaccinesByBrand(brand);
    res.json(result);
  });


router.get('/history/:vaccine_id', requireAuth, async function(req, res) {
    const result = await getVaccineHistory(req.params.vaccine_id)
    res.json(result);
});
router.get('/request/all',requireAuth, async function(req, res) {
    console.log("Inside");
    const vaccines = await getAllVaccines();
    const results = [];
    for(let i = 0; i < vaccines.length; i++){
        results.push(await getVaccine(vaccines[i]['Key']));
        
    }
    
    // console.log(result[0]['Value']);
    const incomingRequests = []
    results.forEach(result => {
        console.log(result);

        if(result['transactionType'] == "TRANSFER_REQUESTED"){
            incomingRequests.push(result);
        }
    })
    res.json(incomingRequests);
});
router.post('/', requireAuth,  async function(req, res){
    const{vaccine} = req.body
    console.log(vaccine)
    await addVaccine(vaccine, req.session.username);
    res.status(200).json(await getVaccineHistory(vaccine.vaccineId))
});

router.post('/violation', async function(req, res){
    try {
        const { vaccine_id, violations } = req.body;

        if (!vaccine_id || !violations) {
        return res.status(400).json({ error: 'Invalid request body format' });
        }
        
        const result = registerViolations(vaccine_id, violations);
        
        res.status(200).json(result);

    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.post('/violations', async function(req, res){
    try {
        const { container_id, violations } = req.body;

        if (!container_id || !violations) {
        return res.status(400).json({ error: 'Invalid request body format' });
        }
        
        const vaccines = await getAllVaccinesContainer(container_id);
        const results = [];
        for(let i = 0; i < vaccines.length; i++){
            results.push(await getVaccine(vaccines[i]['Key']));
            
        }
        
        const incomingRequests = []
        results.forEach(result => {
            console.log(result);
            registerViolations(result["vaccineId"], violations, result);
        })
        
        res.status(200).json({});

    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/transfer', requireAuth, async function(req, res){
    try{
        const { vaccine_id } = req.body;
        await transferOwner(vaccine_id, req.session.username);
        const result = await getVaccine(vaccine_id);
        res.status(200).json(result);
    }
    catch(error){
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

async function registerUserDB(username, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
}

router.post('/register', requireAuth, async function(req, res){
    try{
        if(req.session.username != 'admin')
            return res.status(400).json({error:'Not authorized, only admin has access'});

        const {user_id, user_password} = req.body;
        await registerUserDB(user_id, user_password);

        await registerUser(user_id);
        res.status(200).json({message : 'Succesfully registered user'});
    }
    catch(error){
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/request', requireAuth, async function(req, res){
    try{
        const { vaccine_id } = req.body;
        await requestTransfer(vaccine_id, req.session.username);
        const result = await getVaccine(vaccine_id);
        res.status(200).json(result);
    }
    catch(error){
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;