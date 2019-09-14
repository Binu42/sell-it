const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary');
const mongoose = require('mongoose');

const {ensureAuthenticated} = require('../helper/auth');
const upload = require('../handlers/multer');
require('../models/Sports');
const Sport = mongoose.model('sports');

router.get('/sell', ensureAuthenticated, (req, res) => {
    res.render('sport/sell');
});

router.get('/buy', ensureAuthenticated, (req, res)=> {
    Sport.find()
    .then(items => {
        res.render('sport/buy', {sports: items});
    })
});

router.post('/sell', ensureAuthenticated, upload.single('sport_pic'), async(req, res)=> {
    const result = await cloudinary.v2.uploader.upload(req.file.path, {
        width: 250,
        height: 250,
        gravity: "faces",
        crop: "fill"
    });
    const newSportItem = new Sport({
        user: req.user.id,
        name: req.body.name,
        company: req.body.company,
        used: req.body.year,
        image: result.secure_url,
        description: req.body.description,
        price: req.body.price
    })
    newSportItem.save()
    .then(sport => {
        req.flash('sucess_msg', 'Successfully uploaded');
        res.redirect('/sports/buy');
    })
    .catch(error => {
        console.log(error);
        return
    })
})

router.get('/:id', (req, res)=> {
    Sport.findOne({_id: req.params.id})
    .populate('user', ['name', 'address', 'contact', 'profile'])
    .populate('comments.commentUser', ['name', 'profile'])
    .then(item => {
        res.render('sport/details', {item: item});
    })
    .catch(error => {
        console.log(error);
        return;
    })
})

router.post('/comments/:id', (req, res)=> {
    Sport.findOne({_id: req.params.id})
    .then(sport => {
        const newComment = {
            commentBody: req.body.comment,
            commentUser: req.user.id
        }

        sport.comments.unshift(newComment);
        sport.save()
            .then(sport => {
                req.flash('success_msg', 'Your Comment Added !');
                res.redirect('/sports/' + sport.id);
            })
    })
})

module.exports = router;