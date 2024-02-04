var express = require('express');
var router = express.Router();
const {getVaccinesByBrand , registerViolations, getVaccineHistory, addVaccine, getVaccine}= require("../application/vaccine.js")

router.get('/:vaccine_id', async function(req, res, next) {
    const result = await getVaccine(req.params.vaccine_id);
    res.json(result);
});

router.get('/brand/:brand', async function(req, res, next) {
    const brand = req.params.brand;
    const result = await getVaccinesByBrand(brand);
    res.json(result);
  });



router.get('/history/:vaccine_id', async function(req, res) {
    const result = await getVaccineHistory(req.params.vaccine_id)
    res.json(result);
});

router.post('/', async function(req, res){
    const{vaccine} = req.body
    await addVaccine(vaccine)
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


module.exports = router;