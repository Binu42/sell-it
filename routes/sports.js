const express = require('express');
const router = express.Router();

router.get('/sell', (req, res) => {
    res.render('sport/sell');
});

router.get('/buy', (req, res)=> {
    res.render('sport/buy');
})
module.exports = router;