// dependencies
const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary');
const mongoose = require('mongoose');

// authenticated or not
const {
    ensureAuthenticated
} = require('../helper/auth');
// upload image
const upload = require('../handlers/multer');

// sport Schema
require('../models/Sports');
const Sport = mongoose.model('sports');

// @Access  private
// @route   get /sports/sell
// @desc    form for selling sports
router.get('/sell', ensureAuthenticated, (req, res) => {
    res.render('sport/sell');
});

// @Access  private
// @route   get /sports/buy
// @desc    page for sports item buying
router.get('/buy', ensureAuthenticated, (req, res) => {
    Sport.find()
        .then(items => {
            res.render('sport/buy', {
                sports: items
            });
        })
});

// @Access  private
// @route   post /sports/sell
// @desc    sell sport item
router.post('/sell', ensureAuthenticated, upload.single('sport_pic'), async (req, res) => {
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
            req.flash('success_msg', 'Successfully uploaded');
            res.redirect('/sports/buy');
        })
        .catch(error => {
            console.log(error);
            return
        })
})

// @Access  private
// @route   get /sports/id
// @desc    details for single sport item
router.get('/:id', ensureAuthenticated, (req, res) => {
    Sport.findOne({
            _id: req.params.id
        })
        .populate('user', ['name', 'address', 'contact', 'profile'])
        .populate('comments.commentUser', ['name', 'profile'])
        .then(item => {
            res.render('sport/details', {
                item: item
            });
        })
        .catch(error => {
            console.log(error);
            return;
        })
})

// @Access  private
// @route   post /sports/comment/id
// @desc    comment on sport Item
router.post('/comments/:id', ensureAuthenticated, (req, res) => {
    Sport.findOne({
            _id: req.params.id
        })
        .then(sport => {
            const newComment = {
                commentBody: req.body.comment,
                commentUser: req.user.id
            }
            sport.comments.unshift(newComment);
            sport.save()
                .then(sport => {
                    req.flash('success_msg', 'Your Comment is Added !');
                    res.redirect('/sports/' + sport.id);
                })
        })
        .catch(error => {
            console.log(error);
            return;
        })
});

// @Access  private
// @route   get /sports/comment/sportItemId/commentId
// @desc    Delete comment on sport Item by comment User
router.get('/comments/:sportId/:commentId', ensureAuthenticated, (req, res) => {
    Sport.findOne({
            _id: req.params.sportId
        })
        .then(async sport => {
            const comment = await sport.comments.find(comment => comment.id.toString() === req.params.commentId.toString())
            if(!comment){
                req.flash('error_msg', 'comment does not exist');
                res.redirect('/sports/' + req.params.sportId);
            }
            if (comment) {
                if (comment.commentUser.toString() === req.user.id.toString()) {
                    const index = sport.comments.map(comment => comment.id).indexOf(req.params.commentId);
                    if (index !== -1) {
                        sport.comments.splice(index, 1);
                        sport.save()
                            .then(sport => {
                                req.flash('success_msg', 'Your Comment is Removed !');
                                res.redirect('/sports/' + req.params.sportId);
                            })
                    } else {
                        req.flash('error_msg', 'comment does not exist');
                        res.redirect('/sports/' + req.params.sportId);
                    }
                }else {
                    req.flash('error_msg', 'You are not Authorized');
                    res.redirect('/sports/' + req.params.sportId);
                }
            }
        })
        .catch(error => {
            console.log(error);
            return;
        })
})

// @Access  private
// @route   get /sports/edit/id
// @desc    edit of sport Items
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Sport.findOne({
            _id: req.params.id
        })
        .then(sport => {
            if (sport.user.toString() === req.user.id.toString()) {
                res.render('sport/edit', {
                    sport: sport
                });
            } else {
                req.flash('error_msg', 'You are not Authorized');
                res.redirect('/sports/' + req.params.id);
            }
        })
        .catch(error => {
            console.log(error);
            return;
        })
});

// @Access  private
// @route   delete /sports/id
// @desc    delete of sport Item
router.delete('/:id', ensureAuthenticated, (req, res) => {
    Sport.findOne({
            _id: req.params.id
        })
        .then(item => {
            if (item.user.toString() === req.user.id.toString()) {
                const name = item.image.substr(62).slice(0, -4);
                cloudinary.v2.uploader.destroy(name, (error, result) => {
                    if(!error){
                        console.log(result);
                    }else{
                        console.log(error);
                    }
                });
                item.remove()
                    .then(item => {
                        req.flash('success_msg', "Sport Item is Removed");
                        res.redirect('/sports/buy');
                    })
            } else {
                req.flash('error_msg', 'You\'r not Authorized');
                res.redirect('/sports/buy');
            }
        })
        .catch(error => {
            console.log(error);
            return;
        })
});

// @Access  private
// @route   put /sports/id
// @desc    Edit of sport Item
router.put('/:id', ensureAuthenticated, (req, res) => {
    Sport.findOne({
            _id: req.params.id
        })
        .then(sport => {
            if (sport.user.toString() === req.user.id.toString()) {
                sport.name = req.body.name,
                    sport.company = req.body.company,
                    sport.used = req.body.year,
                    sport.description = req.body.description,
                    sport.price = req.body.price
                sport.save()
                    .then(sport => {
                        req.flash('success_msg', "Sport Item is updated");
                        res.redirect('/sports/buy');
                    })
            } else {
                req.flash('error_msg', 'You\'r not Authorized');
                res.redirect('/sports/buy');
            }
        })
        .catch(error => {
            console.log(error);
            return;
        })
});

router.post('/search', ensureAuthenticated, (req, res) => {
    let searchedItem = [];
    Sport.find({})
        .then(sports => {
            for (let i = 0; i < sports.length; i++) {
                if (sports[i].name.toLowerCase().includes(req.body.search)) {
                    searchedItem.push(sports[i]);
                }
            }
            res.render('sport/buy', {
                sports: searchedItem
            });
        })
})

module.exports = router;