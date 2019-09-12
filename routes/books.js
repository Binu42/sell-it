const express = require('express');
const router = express.Router();

router.get('/sell', (req, res) => {
    res.render('book/sell');
});

router.get('/buy', (req, res)=> {
    res.render('book/buy');
})

router.get('/rental', (req, res)=> {
    res.render('book/rental');
});

router.get('/recycle', (req, res)=> {
    res.render('book/recycle');
})
module.exports = router;